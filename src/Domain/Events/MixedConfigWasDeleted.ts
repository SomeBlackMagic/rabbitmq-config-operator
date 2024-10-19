import {DispatchableEvent} from "@framework/EventDispatcher";
import {V1alpha1MixedConfig} from "@RabbitMQConfigOperator/Domain/Entity/CRD/mixedconfigs.generated";
import GlobalConnectionWasAdded from "@RabbitMQConfigOperator/Domain/Events/MixedConfigWasAdded";

export default class MixedConfigWasDeleted extends DispatchableEvent {
    public constructor(
        private _object:V1alpha1MixedConfig
    ) {
        super('MixedConfigWasDeleted');
    }

    public get object(): V1alpha1MixedConfig {
        return this._object;
    }
}