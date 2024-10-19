import {DispatchableEvent} from "@framework/EventDispatcher";

export class MixedConfigReady extends DispatchableEvent {

    private readonly _lastUpdatedTime: Date = new Date();

    public constructor(
        private readonly _resourceName:string,
        private readonly _namespace:string,
        private readonly _isReady:boolean,
        private readonly _clusterName: string = 'null',
        private readonly _rabbitmqVersion: string = 'null',
        private readonly _reason?: string,
        private readonly _message?: string,
    ) {
        super('MixedConfigReady');
    }

    public get resourceName(): string {
        return this._resourceName;
    }

    public get isReady(): boolean {
        return this._isReady;
    }

    public get lastUpdatedTime(): Date {
        return this._lastUpdatedTime;
    }

    public get clusterName(): string {
        return this._clusterName;
    }

    public get rabbitmqVersion(): string {
        return this._rabbitmqVersion;
    }

    public get reason(): string {
        return this._reason;
    }

    public get message(): string {
        return this._message;
    }

    public get namespace(): string {
        return this._namespace;
    }
}

