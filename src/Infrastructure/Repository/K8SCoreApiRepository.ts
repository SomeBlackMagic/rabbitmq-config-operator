import * as k8s from "@kubernetes/client-node";
import {CoreV1Api} from "@kubernetes/client-node";
import {inject, injectable} from "tsyringe";


@injectable()
export default class K8SCoreApiRepository {

    private api: k8s.CoreV1Api;

    constructor(
        @inject('K8SKernel.kubeConfig') kubeConfig: k8s.KubeConfig
    ) {
        this.api = kubeConfig.makeApiClient(CoreV1Api);
    }

    public async getSecretData(namespace: string, secretName: string, field: string): Promise<string>  {
        return await this.api.readNamespacedSecret(secretName, namespace)
            .then((res)=> {
                // TODO add check  field exist in data
                return Buffer.from(res.body.data[field], 'base64').toString('utf-8');
            })
            .catch(reason => {
                throw new Error(reason.body.status + ': ' + reason.body.message + ' namespace: ' + namespace);
                // switch (reason.body.kind) {
                //     case 'Status':
                //
                //
                // }

            })

    }
}