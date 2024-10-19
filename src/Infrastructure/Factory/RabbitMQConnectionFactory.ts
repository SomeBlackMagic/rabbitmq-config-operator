import {ConnectionEntity} from "@RabbitMQConfigOperator/Domain/Entity/ConnectionEntity";
import Client from "@RabbitMQConfigOperator/Libs/RabbitMQAdminClient/Client";
import {registry} from "tsyringe";

@registry()
export class RabbitMQConnectionFactory {

    public makeClient(
        https: boolean,
        host: string,
        login: string,
        pass: string,
        skipTLSVerification: boolean = false,

    ) {
        return new Client(
            host,
            login,
            pass,
            https,
            skipTLSVerification
        )
    }
}