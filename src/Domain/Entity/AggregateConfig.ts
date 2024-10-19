import {VhostEntity} from "@RabbitMQConfigOperator/Domain/Entity/VhostEntity";
import {injectable} from "tsyringe";

@injectable()
export class AggregateConfig {
    private vhosts: VhostEntity[] = [];

    public addVhostFromCRD(list: object[]|any[]) {
        list.forEach(item => {
            this.vhosts.push({
                name: item.name,
                description: item.description ?? '',
                tags: item.tags ?? '',
                defaultQueueType: item.defaultQueueType ?? ''

            });
        })
    }

    public addUsersFromCRD(list: object[]) {

    }

}