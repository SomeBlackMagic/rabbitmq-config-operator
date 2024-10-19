import ConnectionProcessor from "@RabbitMQConfigOperator/Application/Processor/ConnectionProcessor";
import {MixedConfigProcessor} from "@RabbitMQConfigOperator/Application/Processor/MixedConfigProcessor";
import {container} from "tsyringe";

export default class ApplicationLayerConfig {
    public static getDIConfig() {
        return [
            container.resolve(ConnectionProcessor),
            container.resolve(MixedConfigProcessor)
        ]
    }
}