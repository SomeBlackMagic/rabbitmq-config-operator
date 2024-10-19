import {container, injectable, singleton} from "tsyringe";

export function registerIntoDIAsObject(name: string) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {

        injectable()(constructor);
        const instance = container.resolve(constructor);
        container.registerInstance(name, instance);

    };
}

export function DIRegister(name: string|any) {
    return function <T extends { new (...args: any[]): {} }>(constructor: T) {

        injectable()(constructor);
        container.register(name, constructor);

    };
}


export function EventListener(eventName: string) {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        if (!Reflect.hasMetadata('eventListeners', target)) {
            Reflect.defineMetadata('eventListeners', [], target);
        }

        const listeners = Reflect.getMetadata('eventListeners', target);
        listeners.push({ eventName, method: propertyKey });
    };
}

