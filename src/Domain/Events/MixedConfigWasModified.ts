import {DispatchableEvent} from "@framework/EventDispatcher";
import {V1alpha1MixedConfig} from "@RabbitMQConfigOperator/Domain/Entity/CRD/mixedconfigs.generated";

export default class MixedConfigWasModified extends DispatchableEvent {
    public constructor(
        private _oldObject:V1alpha1MixedConfig,
        private _newObject:V1alpha1MixedConfig
    ) {
        super('MixedConfigWasModified');
    }


    get oldObject(): V1alpha1MixedConfig {
        return this._oldObject;
    }

    get newObject(): V1alpha1MixedConfig {
        return this._newObject;
    }
}