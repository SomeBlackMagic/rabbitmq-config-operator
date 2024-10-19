import {Logger} from '@elementary-lab/logger/src';
import {LoggerConfigInterface} from '@elementary-lab/logger/src/Interface/LoggerConfigInterface';
import {gracefulShutdown} from "@framework/Decorator/Core";
import {WebServer} from "@framework/HttpKernel/WebServer";
import { env, loadEnvFile } from './Helpers/functions';
import * as fs from 'fs';
import * as console from "console";
import { Registry } from 'ts-registry';
import {container} from "tsyringe";
import EventDispatcher from "./EventDispatcher";

export class Core {

    private static $self: Core;

    private static appInfo: AppInfo;

    public static app(): Core {
        if (Core.$self === undefined) {
            throw Error('Application not bootstrap');
        }

        return Core.$self;
    }

    private registry: Registry<any> = null;

    public static loadEnv(): void {
        let currentEnv = env('APP_ENV');
        if (fs.existsSync(process.cwd() + '/.env.local')) {
            const env = loadEnvFile(process.cwd() + '/.env.local');
            if (env === false) {
                process.exit(1);
            } else {
                console.log('[loadEnv] Load: .env.local')
            }
        }
        if (currentEnv !== null && currentEnv !== 'local') {
            if (fs.existsSync(process.cwd() + '/.env.' + currentEnv)) {
                const env = loadEnvFile(process.cwd() + '/.env.' + currentEnv);
                if (env === false) {
                    process.exit(1);
                } else {
                    console.log('[loadEnv] .env.' + currentEnv)
                }
            }
        }
    }

    public static bootstrap(info: AppInfo, coreConfig: CoreConfigInterface):void {
        Core.$self = new Core(coreConfig);
        Core.appInfo = info;
        Core.info('Hello ' + info.id, {version: info.version});


    }

    private constructor(coreConfig: CoreConfigInterface) {
        this.registerService('logger', new Logger(coreConfig.log));
        this.registerService('event-bus', new EventDispatcher());
    }

    public registerService(key: string, object: any): void {
        container.register('Core.'+key, {useValue: object})
    }

    /**
     *
     * @param key
     */
    public get<T>(key: string): T {
        return container.resolve<T>('Core.'+key)
    }

    public static info(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').info(message, context, category);
    }
    public static emergency(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').emergency(message, context, category);
    }
    public static error(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').error(message, context, category);
    }
    public static debug(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').debug(message, context, category);
    }
    public static warn(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').warn(message, context, category);
    }
    public static profile(message: string, context?: any, category: string = 'application') {
        Core.app().get<Logger>('logger').profile(message, context, category);
    }

    //public exitHandler: Function;


    public subscribeOnProcessExit(): void {
        /*catches ctrl+c event*/
        process.on('SIGINT', this.exitHandler.bind(null, {exit: true, code:'SIGINT'}));
        process.on('SIGQUIT', this.exitHandler.bind(null, {exit: true, code:'SIGQUIT'}));

        /*catches "kill pid" (for example: nodemon restart)*/
        process.on('SIGUSR1', this.exitHandler.bind(null, {exit: true, code:'SIGUSR1'}));
        process.on('SIGUSR2', this.exitHandler.bind(null, {exit: true, code:'SIGUSR2'}));
        process.on('SIGTERM', this.exitHandler.bind(null, {exit: true, code:'SIGTERM'}));

        /*catches uncaught exceptions*/
        process.on('uncaughtException', this.uncaughtExceptionHandler);
        process.on('unhandledRejection', this.uncaughtRejectionHandler);

    }

    // public setExitHandler(cb: Function): void {
    //     this.exitHandler = cb;
    // }
    private exitHandler(data: any) {
        Core.info('PCNTL signal received. Closing connection server.', [data.code]);
        (async () => {
            const fns = Core.shutdownHandlers;
            const promiseList = fns.map(fn => {
                    return fn()
            });
            await Promise.all(promiseList);

            container.resolve<WebServer>('WebServer').stop();
            Core.info('System gracefully stopped');
            // @ts-ignore
            await process.flushLogs();
        })();
    }

    public uncaughtExceptionHandler(error: Error) {
        Core.error(error.message, error.stack, error.name);
        process.exit(99);

    }

    public uncaughtRejectionHandler(reason: {} | null | undefined, promise: Promise<any>) {
        if (typeof reason !== 'undefined') {
            Core.error(reason.toString());
        }
        process.exit(99);

    }

    private static shutdownHandlers: Function[] = [];

    public static pushShutdownHandler(callback: Function) {
        Core.shutdownHandlers.push(callback);
    }

    @gracefulShutdown
    private async onGracefullyShutdown() {
        // @ts-ignore
        await process.flushLogs();
        return Promise.resolve();
    }
}

export interface AppInfo {
    id: string;
    version: string;
    environment: string;
}

export interface CoreConfigInterface {
    log: LoggerConfigInterface;
}
