// import {inject, injectable} from "tsyringe";
// import EventDispatcher from "../../Kernel/EventDispatcher";
// import GlobalConnectionWasAdded from "../Events/GlobalConnectionWasAdded";
// import GlobalConnectionEventProcessed from "../Events/GlobalConnectionEventProcessed";
// import GlobalConnectionWasModified from "../Events/GlobalConnectionWasModified";
//
// @injectable()
// export default class RemapingLogic {
//
//     private map: Map<string, string>;
//
//     public constructor(
//         @inject(EventDispatcher) private eventBus: EventDispatcher
//     ) {
//         this.eventBus.addEventListener('SeverityRemaperWasAdded', this.catchSeverityRemaperWasAdded.bind(this))
//         this.eventBus.addEventListener('SeverityRemaperWasModified', this.catchSeverityRemaperWasModified.bind(this))
//     }
//
//     public async processRemap(message: PrometheusAlertEntity[]) {
//         return message.map((item) => {
//             if (this.map.has(item.labels.alertname)) {
//                 item.labels.severity  = this.map.get(item.labels.alertname)
//                 return item
//             }
//             return item
//         });
//     }
//
//     private catchSeverityRemaperWasAdded(event: GlobalConnectionWasAdded) {
//         let mapping = [];
//         event.object.spec.map.forEach((item) => {
//             mapping.push([item.alertName, item.destinationSeverity]);
//         });
//
//         this.map = new Map<string, string>(mapping);
//
//         this.eventBus.dispatchEvent(new GlobalConnectionEventProcessed(event.object.metadata.name, {
//             type: 'Ready',
//             status: 'Loaded to app',
//             lastTransitionTime: new Date().toString(),
//             reason: 'SeverityRemaperEventProcessed',
//             message: 'Config loaded to app',
//         }))
//     }
//
//     private catchSeverityRemaperWasModified(event: GlobalConnectionWasModified) {
//         let mapping = [];
//         event.newObject.spec.map.forEach((item) => {
//             mapping.push([item.alertName, item.destinationSeverity]);
//         });
//
//         this.map = new Map<string, string>(mapping);
//
//         this.eventBus.dispatchEvent(new GlobalConnectionEventProcessed(event.newObject.metadata.name, {
//             type: 'Ready',
//             status: 'Config updated',
//             lastTransitionTime: new Date().toString(),
//             reason: 'SeverityRemaperEventProcessed',
//             message: 'Map in application was updated',
//         }))
//     }
//
//
// }