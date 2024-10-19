// import {CommandBusInterface, TacticianCommandBus} from "./TacticianCommandBus";
// import {container} from "tsyringe";
//
// import {CommandHandlerInterface} from "./CommandHandlerInterface";
//
//
// export default class BusConfiguration {
//
//     private handlers: object = {}
//
//     private middlewares: [] = [];
//     public withHandler(handler: any): BusConfiguration {
//
//         this.handlers[handler.name] = new handler()
//         return this;
//     }
//     public withHandlerFromDI(): BusConfiguration {
//
//
//         return this;
//     }
//
//     public build(): CommandBusInterface {
//         return new TacticianCommandBus(this.handlers, this.middlewares);
//     }
// }