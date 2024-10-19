import Client, {getOverviewResponse} from "@RabbitMQConfigOperator/Libs/RabbitMQAdminClient/Client";
import {injectable} from "tsyringe";

@injectable()
export default class RabbitMQRepository {

    public constructor(
        private connection: Client|null = null
    ) {
        this.connection = connection;
    }

    public static create(client: Client) {
        return new RabbitMQRepository(client);
    }

    public async getOverview(): Promise<getOverviewResponse> {
        return await this.connection.getOverview();
    }
}