import {container} from "tsyringe";

import {KernelInterface} from "../KernelInterface";
import * as k8s from "@kubernetes/client-node";
import BaseK8SController from "./BaseController";
import {Core} from "../App";
import {ConfigFactory} from "@Config/app-config";
import K8SKernelConfigInterface from "@framework/K8SKernel/ConfigInterface";

export default class K8SKernel implements KernelInterface {
    private kubeConfig: k8s.KubeConfig;
    private kubeApi: k8s.AppsV1Api;
    private kubeApiCustomObjects: k8s.CustomObjectsApi;

    private controllers = [];
    private config: K8SKernelConfigInterface;

    public constructor() {
        this.config = ConfigFactory.getK8SKernelConfig()
    }

    public async boot(): Promise<any> {
        this.kubeConfig = new k8s.KubeConfig();
        this.kubeConfig.loadFromDefault();


        this.kubeApi = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
        this.kubeApiCustomObjects = this.kubeConfig.makeApiClient(k8s.CustomObjectsApi);


        container.register('K8SKernel.kubeConfig', {useValue: this.kubeConfig});
        container.register('K8SKernel.kubeApi', {useValue: this.kubeApi});
        container.register('K8SKernel.kubeApiCustomObjects', {useValue: this.kubeApiCustomObjects});

        if(!container.isRegistered('BaseK8SController'))
        {
            Core.warn('No registered controllers', [], 'BaseK8SController')
            return;
        }

        this.controllers = container.resolveAll<BaseK8SController>('BaseK8SController')
        await Promise.all(
                this.controllers.map((item: BaseK8SController) => {
                return item.init()
            })
        )

    }

    public async run(): Promise<any> {
        await Promise.all(
            this.controllers.map((item: BaseK8SController) => {
                return item.run()
            })
        )
    }
}