import {DispatchableEvent} from "@framework/EventDispatcher";
import {V1alpha1MixedConfig} from "@RabbitMQConfigOperator/Domain/Entity/CRD/mixedconfigs.generated";

export default class MixedConfigWasAdded extends DispatchableEvent {

    public constructor(
        private _object:V1alpha1MixedConfig
    ) {
        super('MixedConfigWasAdded');
    }

    public get object(): V1alpha1MixedConfig {
        return this._object;
    }
}