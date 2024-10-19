import {DispatchableEvent} from "@framework/EventDispatcher";
import {
    V1alpha1GlobalConnection,
} from "@RabbitMQConfigOperator/Domain/Entity/CRD/globalconnection.generated";

export default class GlobalConnectionWasModified extends DispatchableEvent {
    public constructor(
        private _oldObject:V1alpha1GlobalConnection,
        private _newObject:V1alpha1GlobalConnection
    ) {
        super('GlobalConnectionWasModified');
    }


    get oldObject(): V1alpha1GlobalConnection {
        return this._oldObject;
    }

    get newObject(): V1alpha1GlobalConnection {
        return this._newObject;
    }
}