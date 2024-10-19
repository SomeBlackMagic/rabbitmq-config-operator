import {EventListener} from "@framework/Decorator/register";
import EventDispatcher from "@framework/EventDispatcher";
import {TacticianCommandBus} from "@framework/Tactician/TacticianCommandBus";
import ReconcileVhostsCommand from "@RabbitMQConfigOperator/Application/Command/ReconcileVhostsCommand";
import {ReconcileVhosts} from "@RabbitMQConfigOperator/Domain/Events/ReconcileVhosts";
import {inject, injectable} from "tsyringe";

@injectable()
export class ReconcileProcessor {

    public constructor(
        @inject(EventDispatcher) private readonly eventBus: EventDispatcher,
        @inject(TacticianCommandBus) private readonly commandBus: TacticianCommandBus,
    ) {
        this.eventBus = eventBus;
        this.eventBus.registerListeners(this);
    }

    @EventListener('ReconcileVhosts')
    public onReconcileVhosts(event: ReconcileVhosts): void {
        this.commandBus.handle(new ReconcileVhostsCommand(event.eventId, event.connectionName))
    }
}