import {EventListener} from "@framework/Decorator/register";
import EventDispatcher from "@framework/EventDispatcher";
import {AggregateConfig} from "@RabbitMQConfigOperator/Domain/Entity/AggregateConfig";
import MixedConfigWasAdded from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasAdded";
import MixedConfigWasModified from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasModified";
import {inject, injectable} from "tsyringe";

@injectable()
export class MixedConfigProcessor {

    public constructor(
        @inject(EventDispatcher) private readonly eventBus: EventDispatcher,
        @inject(AggregateConfig) private readonly aggregateConfig: AggregateConfig,

    ) {
        this.eventBus = eventBus;
        this.aggregateConfig = aggregateConfig;
        this.eventBus.registerListeners(this);
    }

    @EventListener('MixedConfigWasAdded')
    public onMixedConfigResorceCreated(event: MixedConfigWasAdded) {
        this.aggregateConfig.addVhostFromCRD(event.object.spec.vhosts);
        this.aggregateConfig.addUsersFromCRD(event.object.spec.users);
    }


    public onMixedConfigResorceUpdated(event: MixedConfigWasModified) {

        this.aggregateConfig.addVhostFromCRD(event.newObject.spec.vhosts);
        this.aggregateConfig.addUsersFromCRD(event.newObject.spec.users);
    }


}