import {BaseModule} from "@framework/BaseModule";
import {DIRegister} from "@framework/Decorator/register";
import { BaseCommand } from '@framework/Tactician/BaseCommand';
import {Core} from '@framework/App';
import {CommandHandlerInterface} from "@framework/Tactician/CommandHandlerInterface";
import {container, singleton} from "tsyringe";

const {
    CommandBus,
    CommandHandlerMiddleware,
    ClassNameExtractor,
    InMemoryLocator,
    HandleInflector,
    LoggerMiddleware
} = require('simple-command-bus');

@singleton()
@DIRegister(TacticianCommandBus)
export class TacticianCommandBus extends BaseModule<TacticianCommandBus> implements CommandBusInterface {

    private commandBus;

    private handlers: object = {}

    private middlewares: [] = [];


    public init(): Promise<false | true | this> {
        if(!container.isRegistered('CommandHandlerInterface')) {
            Core.error('Not found handlers','TacticianCommandBus')
            return Promise.resolve(false);
        }

        const handlers  = container.resolveAll<CommandHandlerInterface<any>>('CommandHandlerInterface')
        handlers.map((handlerItem) => {
            // @ts-ignore
            this.handlers[handlerItem.constructor.name] = handlerItem;
        });
        return Promise.resolve(true);
    }

    public run(): Promise<false | true | this> {
        // Handler middleware
        let commandHandlerMiddleware = new CommandHandlerMiddleware(
            new ClassNameExtractor(),
            new InMemoryLocator(this.handlers),
            new HandleInflector(),
        );

        this.commandBus = new CommandBus([
            ...this.middlewares,
            new LoggerMiddleware({
                log: (text, command: BaseCommand, returnValue) => {
                    Core.info(text + '-> ' + command.$name, [command.$uuid, returnValue], 'CommandBus' );
                }

            }),
            commandHandlerMiddleware
        ]);

        return Promise.resolve(true);

    }


    public handle<TResult>(command: BaseCommand): TResult {
        return this.commandBus.handle(command);
    }
}

export interface CommandBusInterface {
    handle<TResult>(command: BaseCommand): TResult;
}