import ReconcileVhostsHandler from "@RabbitMQConfigOperator/Application/Command/ReconcileVhostsHandler";
import {container} from "tsyringe";

export default class CommandBusConfig {
    public static getDIConfig() {
        return [
            container.resolve(ReconcileVhostsHandler),
        ]
    }
}