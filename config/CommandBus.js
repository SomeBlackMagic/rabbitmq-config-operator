"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ReconcileVhostsHandler_1 = tslib_1.__importDefault(require("@RabbitMQConfigOperator/Application/Command/ReconcileVhostsHandler"));
const tsyringe_1 = require("tsyringe");
class CommandBusConfig {
    static getDIConfig() {
        return [
            tsyringe_1.container.resolve(ReconcileVhostsHandler_1.default),
        ];
    }
}
exports.default = CommandBusConfig;
//# sourceMappingURL=CommandBus.js.map