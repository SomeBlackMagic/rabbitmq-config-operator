import {DispatchableEvent} from "@framework/EventDispatcher";
import * as Domain from "node:domain";

export class ReconcileVhosts extends DispatchableEvent {

    public constructor(
        private readonly _connectionName:string,
    ) {
        super('ReconcileVhosts');
        this._connectionName = _connectionName;
    }

    get connectionName(): string {
        return this._connectionName;
    }
}