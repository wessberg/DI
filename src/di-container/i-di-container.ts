import {
  IRegisterOptionsWithImplementation,
  IRegisterOptionsWithoutImplementation,
  RegisterOptions,
} from "../register-options/i-register-options";
import { IGetOptions } from "../get-options/i-get-options";
import { IHasOptions } from "../has-options/i-has-options";
import { ImplementationInstance } from "../implementation/implementation";
import { ConstructorArgument } from '../constructor-arguments/constructor-argument';
import { RegistrationRecord } from '../registration-record/i-registration-record';

export interface IDIContainer {
  registerSingleton<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void;
  registerSingleton<T, U extends T = T>(
    newExpression: ImplementationInstance<U>,
    options: IRegisterOptionsWithoutImplementation
  ): void;
  registerSingleton<T, U extends T = T>(
    newExpression: undefined,
    options: IRegisterOptionsWithImplementation<U>
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression: ImplementationInstance<U>,
    options: IRegisterOptionsWithoutImplementation
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression: undefined,
    options: IRegisterOptionsWithImplementation<U>
  ): void;
  get<T>(options?: IGetOptions): T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  has<T>(options?: IHasOptions): boolean;
}


/**
  * Contains all maps in a object, so that Moddable can "preload" the object into flash memory.  See
  * https://github.com/Moddable-OpenSource/moddable/blob/83dadd3def6d2e7e75fc003a5ab409aa81275dd8/documentation/xs/preload.md
  * for information on Moddable preloading, but the basic concept is code that the startup code is
  * executed during the linker so that the resulting slots (variables) can be placed into flash ROM to
  * reduce the memory footprint.  By moving these maps into an object, Moddable will freeze the object
  * but allow the members (the maps) to be writable at runtime.
  */
export interface IDIContainerMaps {
  /**
   * A map between interface names and the services that should be dependency injected
   */
  constructorArguments: Map<string, ConstructorArgument[]>;
  /**
   * A Map between identifying names for services and their IRegistrationRecords.
   */
  serviceRegistry: Map<string, RegistrationRecord<unknown>>;

  /**
   * A map between identifying names for services and concrete instances of their implementation.
   */
  instances: Map<string, unknown>;
}
