import {DispatchableEvent} from "@framework/EventDispatcher";
import {
    V1alpha1GlobalConnection
} from "@RabbitMQConfigOperator/Domain/Entity/CRD/globalconnection.generated";

export default class GlobalConnectionWasDeleted extends DispatchableEvent {
    public constructor(private _object:V1alpha1GlobalConnection) {
        super('GlobalConnectionWasDeleted');
    }

    get object(): V1alpha1GlobalConnection {
        return this._object;
    }
}