import {ConnectionEntity} from "@RabbitMQConfigOperator/Domain/Entity/ConnectionEntity";
import RabbitMQRepository from "@RabbitMQConfigOperator/Infrastructure/Repository/RabbitMQRepository";
import {ConnectionManager} from "@RabbitMQConfigOperator/Infrastructure/Сonnection/ConnectionManager";
import {singleton} from "tsyringe";

@singleton()
export class ConnectionProvider {

    private readonly repositoryClass = RabbitMQRepository;

    public constructor(
        private readonly connectionManager: ConnectionManager,
    ) {
    }
    private connections: Map<string, ConnectionEntity> = new Map();


    public async addNewConnection(connection: ConnectionEntity) {
        this.connections.set(connection.name, connection);
        await this.connectionManager.startPeriodicTask(connection.name)
    }

    // public addNewConnection(connection: ConnectionEntity) {
    //     await this.connectionManager.stopPeriodicTask(connection.name)
    //     this.connections.push(connection);
    //     this.connectionManager.startPeriodicTask(connection.name)
    // }

    public getRepositoryByConnectionName(connectionName: string) {
        if(!this.connections.has(connectionName)) {
            throw new Error('Connection not found');
        }
        const connection = this.connections.get(connectionName);

        return this.repositoryClass.create(connection.client);
    }


}