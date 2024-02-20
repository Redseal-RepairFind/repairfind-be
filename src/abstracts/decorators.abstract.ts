import { Logger } from "../utils/logger";

export function handleAsyncError() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error: unknown) {
        console.error(error);
        Logger.Info('Handle Async caught an exception', error);
        //@ts-ignore
        this.next(error);
      }
    };

    return descriptor;
  };
}
