// import { env, envBoolean, envEnum, envNumber } from '../Kernel/Helpers/functions';
import {ConsoleTarget} from '@elementary-lab/logger/src/Targets/ConsoleTarget';
import {SentryTarget} from '@elementary-lab/logger/src/Targets/SentryTarget';
import {LogLevel} from '@elementary-lab/logger/src/Types';
import {AppInfo, CoreConfigInterface} from "@framework/App";
import HttpKernelConfigInterface from "@framework/HttpKernel/ConfigInterface";
import {env, envBoolean} from "@framework/Helpers/functions";
import GlobalConnectionController from "@RabbitMQConfigOperator/Presentation/k8s/GlobalConnectionController";
import K8SKernelConfigInterface from "@framework/K8SKernel/ConfigInterface";
import MixedConfigController from "@RabbitMQConfigOperator/Presentation/k8s/MixedConfigController";


export class ConfigFactory {

    public static getBase(): AppInfo {
        return {
            id: 'RabbitMQ Admin Operator',
            version: env('APP_VERSION'),
            environment: env('APP_ENV'),
        };
    }

    public static getHttpKernelConfig(): HttpKernelConfigInterface {
        return {
            webServer: {
                host: '*',
                port: 3001,
                timeout: 300,
                metrics: {
                    enabled: true,
                    collectDefaultMetrics: false,
                    prefix: ''
                },
                probe: {
                    enabled: true
                },
                controllers: [

                ]
            },
        }
    }

    public static getK8SKernelConfig(): K8SKernelConfigInterface {
        return {
            // currentNamespace: fs.readFileSync('/var/run/secrets/kubernetes.io/serviceaccount/namespace', 'utf8') || 'default',
            currentNamespace: 'default',
            controllers: [
                GlobalConnectionController.name,
                MixedConfigController.name
            ]
        }
    }

    public static getCore(): CoreConfigInterface {

        return {
            log: {
                // @ts-ignore
                flushBySignals: [ 'exit' ],
                flushByCountInterval: 10,
                flushByTimeInterval: 1000,
                traceLevel: 3,
                targets: [
                    new ConsoleTarget({
                        enabled: true,
                        levels: [ LogLevel.INFO, LogLevel.ERROR, LogLevel.NOTICE, LogLevel.DEBUG, LogLevel.WARNING, LogLevel.EMERGENCY]
                    }),
                    new SentryTarget({
                        enabled: envBoolean('APP_SENTRY_ENABLED', false),
                        dsn: env('APP_SENTRY_DSN', 'https://fake@fake.local/123'),
                        release: ConfigFactory.getBase().version,
                        environment: ConfigFactory.getBase().environment,
                        levels: [LogLevel.EMERGENCY, LogLevel.ERROR, LogLevel.WARNING]
                    })
                ]
            }
        };
    }


    public static getServices(): ServicesConfigInterface {
        return {
            alertManagerUrl: env('APP_ALERTMANAGER_URL', 'http://localhost/'),
        };
    }
}

interface ServicesConfigInterface {
    // alertManagerUrl: string
}
