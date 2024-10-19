import {Core} from "@framework/App";
import {DIRegister} from "@framework/Decorator/register";
import EventDispatcher from "@framework/EventDispatcher";
import BaseK8SController from "@framework/K8SKernel/BaseController";
import * as k8s from "@kubernetes/client-node";
import {V1alpha1GlobalConnection} from "@RabbitMQConfigOperator/Domain/Entity/CRD/globalconnection.generated";
import {GlobalConnectionReady} from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionReady";
import {container, inject} from "tsyringe";
import GlobalConnectionWasAdded from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionWasAdded";
import GlobalConnectionWasDeleted from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionWasDeleted";
import GlobalConnectionWasModified from "@RabbitMQConfigOperator/Domain/Events/GlobalConnectionWasModified";
import { ClientRequest } from 'http';

const CRD_GROUP = "rabbitmq-admin.io";
const CRD_VERSION = "v1alpha1";
const CRD_PLURAL = "globalconnections";

@DIRegister('BaseK8SController')
export default class GlobalConnectionController implements BaseK8SController {
    private watcher: k8s.Watch;

    private reconcileScheduled = false;

    private loadedResources: V1alpha1GlobalConnection[] = []

    private eventBus: EventDispatcher;

    private kubeApiCustomObjects: k8s.CustomObjectsApi;

    private abortWatch: (() => Promise<void>) | null = null;

    public constructor(
        @inject(EventDispatcher) eventBus: EventDispatcher
    ) {
        this.eventBus = eventBus;
    }

    public init(): Promise<any> {
        this.eventBus.addEventListener('GlobalConnectionReady', this.onGlobalConnectionReady.bind(this))
        return Promise.resolve()
    }

    public async run(): Promise<any> {
        this.kubeApiCustomObjects = container.resolve<k8s.CustomObjectsApi>('K8SKernel.kubeApiCustomObjects');

        this.watcher = new k8s.Watch(container.resolve<k8s.KubeConfig>('K8SKernel.kubeConfig'));
        await this.watchResource();
    }

    private async watchResource() {
        Core.info(`Start watching ${CRD_GROUP}/${CRD_VERSION}/${CRD_PLURAL}`, [], 'k8s.GlobalConnectionController');
        return this.watcher.watch(
            `/apis/${CRD_GROUP}/${CRD_VERSION}/${CRD_PLURAL}`,
            {},
            this.onEvent.bind(this),
            this.onDone.bind(this),

        ).then((request: ClientRequest) => {
            this.abortWatch = () => {
                return new Promise<void>((resolve, reject) => {
                    try {
                        request.emit('close');
                        request.destroy();
                        resolve();
                    } catch (err) {
                        reject(err);
                    }
                });
            };
        });
    }

    private async onEvent(phase: string, apiObj: V1alpha1GlobalConnection) {
        Core.info('Received event in phase', {phase}, 'k8s.GlobalConnectionController');

        if (phase == "ADDED") {
            await this.handleAddResource(apiObj)
            // scheduleReconcile(apiObj);
            this.loadedResources.push(apiObj);
        } else if (phase == "MODIFIED") {
            try {
                let matched: object | V1alpha1GlobalConnection = {}
                this.loadedResources.forEach((item: V1alpha1GlobalConnection) => {
                    if (
                        apiObj.metadata.name === item.metadata.name &&
                        apiObj.metadata.generation === item.metadata.generation
                    ) {
                        matched = item
                    }
                })

                // @ts-ignore
                if (JSON.stringify(matched) !== '{}' && JSON.stringify(apiObj.spec) === JSON.stringify(matched.spec)) {
                    Core.debug('This object already apply. Skipped', [], 'k8s.GlobalConnectionController')
                    return;
                }

                // @ts-ignore
                this.scheduleReconcile(matched, apiObj);
            } catch (err) {
                // log(err);
            }
        } else if (phase == "DELETED") {
            await this.handleDeleteResource(apiObj)
            this.loadedResources.filter(function (item, idx) {
                return apiObj.metadata.name === item.metadata.name &&
                    apiObj.metadata.generation === item.metadata.generation;
            });
            // await deleteResource(apiObj);
        } else {
            Core.emergency(`k8s: Unknown event type: ${phase} for ${CRD_GROUP}/${CRD_VERSION}/${CRD_PLURAL} `)
        }
    }


    private onDone(err: any) {
        if(err !== null) {
            console.log(this.constructor + ' onDone error');
            console.log(err);
            process.exit(1)
        }
    }

    private scheduleReconcile(oldObject: V1alpha1GlobalConnection, newObject: V1alpha1GlobalConnection) {
        if (!this.reconcileScheduled) {
            setTimeout(this.handleModifyResource.bind(this), 1000, oldObject, newObject);
            this.reconcileScheduled = true;
        }
    }


    private async handleAddResource(obj: V1alpha1GlobalConnection) {
        if (!obj.status) {
            obj.status = {}
        }
        if (!obj.status.info) {
            obj.status.info = {}
        }

        obj.status.conditions = [];
        obj.status.info.clusterName = '';
        obj.status.info.rabbitmqVersion = '';

        await this.kubeApiCustomObjects
            .replaceClusterCustomObjectStatus(
                "rabbitmq-admin.io",
                "v1alpha1",
                "globalconnections",
                obj.metadata.name,
                obj,
            )
            .catch(reason => {
                console.error(reason.response.body);
                process.exit(1);
            })
        this.eventBus.dispatchEvent(new GlobalConnectionWasAdded(obj))

    }

    private async handleModifyResource(oldObject: V1alpha1GlobalConnection, newObject: V1alpha1GlobalConnection) {
        this.eventBus.dispatchEvent(new GlobalConnectionWasModified(oldObject, newObject))
    }

    private async handleDeleteResource(obj: V1alpha1GlobalConnection) {
        this.eventBus.dispatchEvent(new GlobalConnectionWasDeleted(obj))
    }

    public async onGlobalConnectionReady(event: GlobalConnectionReady) {
        try {
            await this.kubeApiCustomObjects.patchClusterCustomObjectStatus(
                CRD_GROUP,
                CRD_VERSION,
                CRD_PLURAL,
                event.resourceName,
                {
                    status: {
                        conditions: [
                            {
                                type: 'Ready',
                                status: event.isReady ? 'Yes' : 'No',
                                lastUpdatedTime: event.lastUpdatedTime.toLocaleString('sv-SE').replace(/[\s\:]/g, '-'),
                                reason: event.reason,
                                message: event.message
                            }
                        ],
                        info: {
                            clusterName: event.clusterName,
                            rabbitmqVersion: event.rabbitmqVersion
                        }
                    }
                },
                undefined,
                undefined,
                undefined,
                {
                    headers: {
                        'Content-Type': 'application/merge-patch+json',
                    },
                }
            )
        } catch (e) {
            console.error(e.body);
            throw e
        }
    }

    //@gracefulShutdown(true)
    public async stop() {
        return await this.abortWatch();
    }
}