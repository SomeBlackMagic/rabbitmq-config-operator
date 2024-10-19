import "reflect-metadata"

import {ConfigFactory} from "@Config/app-config";
import ApplicationLayerConfig from "@Config/Application";
import CommandBusConfig from "@Config/CommandBus";
import {Core} from "@framework/App";
import {KernelInterface} from "@framework/KernelInterface";
import HttpKernel from "@framework/HttpKernel/HttpKernel";
import K8SKernel from "@framework/K8SKernel/K8SKernel";
import {TacticianCommandBus} from "@framework/Tactician/TacticianCommandBus";
import {container} from "tsyringe";

Core.loadEnv();

const configBase = ConfigFactory.getBase();
const configCore = ConfigFactory.getCore();


Core.bootstrap(configBase, configCore);
Core.info('Bootstrap system');

Core.app().subscribeOnProcessExit();


const kernels: KernelInterface[] = []


kernels.push(new HttpKernel());
kernels.push(new K8SKernel());



(async () => {
    const commandBus = container.resolve<TacticianCommandBus>(TacticianCommandBus)

    CommandBusConfig.getDIConfig();

    console.log('Booting kernels');
    await Promise.all(kernels.map((item: KernelInterface) => {return item.boot(); })).catch((error) => {
        Core.error('Can not boot App:');
        throw error;
    });
    await commandBus.init()

    ApplicationLayerConfig.getDIConfig()

    Core.info('Run booting kernels');
    await Promise.all(kernels.map((item: KernelInterface) => {return item.run(); })).catch((error) => {
        Core.error('Can not run App:');
        throw error;
    });
    await commandBus.run()

})();