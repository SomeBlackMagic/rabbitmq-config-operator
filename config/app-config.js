"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigFactory = void 0;
const tslib_1 = require("tslib");
const ConsoleTarget_1 = require("@elementary-lab/logger/src/Targets/ConsoleTarget");
const SentryTarget_1 = require("@elementary-lab/logger/src/Targets/SentryTarget");
const Types_1 = require("@elementary-lab/logger/src/Types");
const functions_1 = require("@framework/Helpers/functions");
const GlobalConnectionController_1 = tslib_1.__importDefault(require("@RabbitMQConfigOperator/Presentation/k8s/GlobalConnectionController"));
const MixedConfigController_1 = tslib_1.__importDefault(require("@RabbitMQConfigOperator/Presentation/k8s/MixedConfigController"));
class ConfigFactory {
    static getBase() {
        return {
            id: 'RabbitMQ Admin Operator',
            version: (0, functions_1.env)('APP_VERSION'),
            environment: (0, functions_1.env)('APP_ENV'),
        };
    }
    static getHttpKernelConfig() {
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
                controllers: []
            },
        };
    }
    static getK8SKernelConfig() {
        return {
            currentNamespace: 'default',
            controllers: [
                GlobalConnectionController_1.default.name,
                MixedConfigController_1.default.name
            ]
        };
    }
    static getCore() {
        return {
            log: {
                flushBySignals: ['exit'],
                flushByCountInterval: 10,
                flushByTimeInterval: 1000,
                traceLevel: 3,
                targets: [
                    new ConsoleTarget_1.ConsoleTarget({
                        enabled: true,
                        levels: [Types_1.LogLevel.INFO, Types_1.LogLevel.ERROR, Types_1.LogLevel.NOTICE, Types_1.LogLevel.DEBUG, Types_1.LogLevel.WARNING, Types_1.LogLevel.EMERGENCY]
                    }),
                    new SentryTarget_1.SentryTarget({
                        enabled: (0, functions_1.envBoolean)('APP_SENTRY_ENABLED', false),
                        dsn: (0, functions_1.env)('APP_SENTRY_DSN', 'https://fake@fake.local/123'),
                        release: ConfigFactory.getBase().version,
                        environment: ConfigFactory.getBase().environment,
                        levels: [Types_1.LogLevel.EMERGENCY, Types_1.LogLevel.ERROR, Types_1.LogLevel.WARNING]
                    })
                ]
            }
        };
    }
    static getServices() {
        return {
            alertManagerUrl: (0, functions_1.env)('APP_ALERTMANAGER_URL', 'http://localhost/'),
        };
    }
}
exports.ConfigFactory = ConfigFactory;
//# sourceMappingURL=app-config.js.map