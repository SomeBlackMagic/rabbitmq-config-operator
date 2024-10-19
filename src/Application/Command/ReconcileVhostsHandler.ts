import {DIRegister} from "@framework/Decorator/register";
import {BaseHandler} from "@framework/Tactician/BaseHandler";
import {ClassConstructor, CommandHandlerInterface} from "@framework/Tactician/CommandHandlerInterface";
import ReconcileVhostsCommand from "@RabbitMQConfigOperator/Application/Command/ReconcileVhostsCommand";

@DIRegister('CommandHandlerInterface')
export default class ReconcileVhostsHandler
    extends BaseHandler<ReconcileVhostsCommand>
    implements CommandHandlerInterface<ReconcileVhostsCommand>
{


    messageType: ClassConstructor<ReconcileVhostsCommand>;
//
    public async handle(message: ReconcileVhostsCommand) {
        // console.log(message)
    }
}