import {ConfigFactory} from "@Config/app-config";
import {injectable} from "tsyringe";

@injectable()
export class ConnectionLogic {

    public fetchSecretField(path: object|any ) {
        return {
            namespace: ConfigFactory.getK8SKernelConfig().currentNamespace,
            secretName: path.valueFrom.secretKeyRef.name,
            key: path.valueFrom.secretKeyRef.key,
        }
    }



    // public checkAvailabilityConnection() {
    //     return {
    //
    //     }
    // }

    // public buildRabbitMQClient(clientName: string, props: object|any): C {
    //     const client = new Client({}, )
    // }
}