import {Core} from "@framework/App";
import {gracefulShutdown} from "@framework/Decorator/Core";
import EventDispatcher from "@framework/EventDispatcher";
import {createRandomInterval} from "@framework/Helpers/functions";
import {ReconcileVhosts} from "@RabbitMQConfigOperator/Domain/Events/ReconcileVhosts";
import {container, inject, singleton} from "tsyringe";

@singleton()
export class ConnectionManager {

    private taskStack: Map<string, NodeJS.Timeout[]> = new Map();

    public constructor(
        @inject(EventDispatcher) private readonly eventBus: EventDispatcher,
    ) {
        this.eventBus = eventBus;
        Core.pushShutdownHandler(this.onShutdown.bind(this));
    }

    public async startPeriodicTask(connectionName: string, connectionNamespace: string = 'global') {
        this.taskStack.set(connectionName, [
            await createRandomInterval(
                this.reconcileVhosts.bind(this, connectionName),
                3000,
                1000,
                2000
            )
        ])
    }

    public async stopPeriodicTask(connectionName: string, connectionNamespace: string = 'global') {

    }

    private reconcileVhosts(connectionName: string) {
        const event = new ReconcileVhosts(connectionName);
        Core.info('Dispatch event ReconcileVhost', {connectionName: connectionName, eventId: event.eventId}, 'ConnectionManager')
        this.eventBus.dispatchEvent(event)
    }

    private onShutdown(): Promise<boolean> {
        return new Promise((resolve) => {
            const ctx = container.resolve(ConnectionManager)
            ctx.taskStack.forEach((tasks) => {
                tasks.forEach((task) => {
                    clearInterval(task);
                })
            })
            setImmediate(() => {
                resolve(true);
            });
        });

    }
}