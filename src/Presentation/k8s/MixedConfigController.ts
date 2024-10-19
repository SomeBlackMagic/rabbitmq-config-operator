import {Core} from "@framework/App";
import {DIRegister, EventListener} from "@framework/Decorator/register";
import EventDispatcher from "@framework/EventDispatcher";
import BaseK8SController from "@framework/K8SKernel/BaseController";
import * as k8s from "@kubernetes/client-node";
import {V1alpha1MixedConfig} from "@RabbitMQConfigOperator/Domain/Entity/CRD/mixedconfigs.generated";
import {MixedConfigReady} from "@RabbitMQConfigOperator/Domain/Events/MixedConfigReady";
import console from "console";
import {ClientRequest} from "http";
import {container, inject} from "tsyringe";
import MixedConfigWasAdded from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasAdded";
import MixedConfigWasDeleted from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasDeleted";
import MixedConfigWasModified from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasModified";

const CRD_GROUP = "rabbitmq-admin.io";
const CRD_VERSION = "v1alpha1";
const CRD_PLURAL = "mixedconfigs";

@DIRegister('BaseK8SController')
export default class MixedConfigController implements BaseK8SController {
    private watcher: k8s.Watch;

    private reconcileScheduled = false;

    private loadedResources: V1alpha1MixedConfig[] = []

    private eventBus: EventDispatcher;

    private kubeApiCustomObjects: k8s.CustomObjectsApi;

    private abortWatch: (() => Promise<void>) | null = null;

    public constructor(
        @inject(EventDispatcher) eventBus: EventDispatcher
    ) {
        this.eventBus = eventBus;
        this.eventBus.registerListeners(this);
    }

    public init(): Promise<any> {
        return Promise.resolve()
    }
    public async run(): Promise<any> {
        this.kubeApiCustomObjects = container.resolve<k8s.CustomObjectsApi>('K8SKernel.kubeApiCustomObjects');

        this.watcher = new k8s.Watch(container.resolve<k8s.KubeConfig>('K8SKernel.kubeConfig'));
        await this.watchResource();
    }

    @EventListener('MixedConfigReady')
    public async onMixedConfigReady(event: MixedConfigReady) {
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
                                lastUpdatedTime: event.lastUpdatedTime.toDateString(),
                                reason: event.reason,
                                message: event.message
                            }
                        ]
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

    private async watchResource() {
        Core.info(`Start watching ${CRD_GROUP}/${CRD_VERSION}/${CRD_PLURAL}`, [], 'k8s.MixedConfigController');
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

    private async onEvent(phase: string, apiObj: V1alpha1MixedConfig) {
        Core.info('Received event in phase', {phase}, 'k8s.MixedConfigController');

        if (phase == "ADDED") {
            await this.handleAddResource(apiObj)
            this.loadedResources.push(apiObj);
        } else if (phase == "MODIFIED") {
            try {
                let matched: object | V1alpha1MixedConfig = {}
                this.loadedResources.forEach((item: V1alpha1MixedConfig) => {
                    if (
                        apiObj.metadata.name === item.metadata.name &&
                        apiObj.metadata.generation === item.metadata.generation
                    ) {
                        matched = item
                    }
                })

                // @ts-ignore
                if (JSON.stringify(matched) !== '{}' && JSON.stringify(apiObj.spec) === JSON.stringify(matched.spec)) {
                    Core.debug('This object already apply. Skipped', [], 'k8s.MixedConfigController')
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

    private scheduleReconcile(oldObject: V1alpha1MixedConfig, newObject: V1alpha1MixedConfig) {
        if (!this.reconcileScheduled) {
            setTimeout(this.handleModifyResource.bind(this), 1000, oldObject, newObject);
            this.reconcileScheduled = true;
        }
    }

    private async handleAddResource(obj: V1alpha1MixedConfig) {
        if (!obj.status) {
            obj.status = {}
        }

        obj.status.conditions = [];

        await this.kubeApiCustomObjects
            .replaceNamespacedCustomObjectStatus(
                CRD_GROUP,
                CRD_VERSION,
                obj.metadata.namespace,
                CRD_PLURAL,
                obj.metadata.name,
                obj,
            )
            .catch(reason => {
                console.error(reason.response.body);
                process.exit(1);
            })
        this.eventBus.dispatchEvent(new MixedConfigWasAdded(obj))

    }

    private async handleModifyResource(oldObject: V1alpha1MixedConfig, newObject: V1alpha1MixedConfig) {
        this.eventBus.dispatchEvent(new MixedConfigWasModified(oldObject, newObject))
    }

    private async handleDeleteResource(obj: V1alpha1MixedConfig) {
        this.eventBus.dispatchEvent(new MixedConfigWasDeleted(obj))
    }

    public async stop(): Promise<any> {
        await this.abortWatch();
        return Promise.resolve();
    }
}