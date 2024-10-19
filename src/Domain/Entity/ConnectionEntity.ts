import {createRandomInterval} from "@framework/Helpers/functions";
import {TacticianCommandBus} from "@framework/Tactician/TacticianCommandBus";
import RabbitMQRepository from "@RabbitMQConfigOperator/Infrastructure/Repository/RabbitMQRepository";
import Client from "@RabbitMQConfigOperator/Libs/RabbitMQAdminClient/Client";

export class ConnectionEntity {
    public readonly name: string

    public readonly fullControl: boolean

    public readonly client: Client

    private applyVhostsTimer:NodeJS.Timeout;

    private applyUsersTimer:NodeJS.Timeout;

    public constructor(name: string, fullControl: boolean, client: Client) {
        this.name = name;
        this.fullControl = fullControl;
        this.client = client;
    }

    public getRepository(): RabbitMQRepository {
        return RabbitMQRepository.create(this.client);
    }

    public async createTimers(commandBus: TacticianCommandBus): Promise<void> {
        this.applyVhostsTimer = await createRandomInterval(
            () => {
                console.log('!!');
            },
            3000,
            100,
            200
        );
    }
}