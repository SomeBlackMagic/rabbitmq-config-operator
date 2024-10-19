import {Core} from "@framework/App";

export function gracefulShutdown(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    if (typeof originalMethod !== 'function') {
        throw new Error('Decorator can only be applied to methods');
    }

    Core.pushShutdownHandler(originalMethod.bind(target));

    return descriptor;
}