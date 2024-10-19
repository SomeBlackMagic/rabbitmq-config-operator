import {BaseCommand} from "@framework/Tactician/BaseCommand";
import {VhostEntity} from "@RabbitMQConfigOperator/Domain/Entity/VhostEntity";

export default class ReconcileVhostsCommand extends BaseCommand {

    /**
     * A unique name that identifies the message. This should be done in namespace style syntax,
     * ie: organisation/domain/command-name
     */
    public readonly $name = 'ReconcileVhostsCommand'

    /**
     * The contract version of this message. This can be incremented if this message changes the
     * number of properties etc to maintain backwards compatibility
     */
    public readonly $version = 1

    public readonly $uuid: string

    private readonly _connectionName: string

    public constructor(uuid: string, connectionName: string) {
        super();
        this.$uuid = uuid
        this._connectionName = connectionName;
    }


    public get connectionName(): string {
        return this._connectionName;
    }
}