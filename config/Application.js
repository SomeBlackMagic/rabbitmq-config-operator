"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ConnectionProcessor_1 = tslib_1.__importDefault(require("@RabbitMQConfigOperator/Application/Processor/ConnectionProcessor"));
const MixedConfigProcessor_1 = require("@RabbitMQConfigOperator/Application/Processor/MixedConfigProcessor");
const tsyringe_1 = require("tsyringe");
class ApplicationLayerConfig {
    static getDIConfig() {
        return [
            tsyringe_1.container.resolve(ConnectionProcessor_1.default),
            tsyringe_1.container.resolve(MixedConfigProcessor_1.MixedConfigProcessor)
        ];
    }
}
exports.default = ApplicationLayerConfig;
//# sourceMappingURL=Application.js.map