import { IConstructInstanceOptions } from "../construct-instance-options/i-construct-instance-options";
import { IParent } from "../construct-instance-options/i-parent";
import { ConstructorArgument } from "../constructor-arguments/constructor-argument";
import { CONSTRUCTOR_ARGUMENTS_SYMBOL } from "../constructor-arguments/constructor-arguments-identifier";
import { IGetOptions } from "../get-options/i-get-options";
import { IHasOptions } from "../has-options/i-has-options";
import { NewableService } from "../newable-service/newable-service";
import {
  IRegisterOptionsWithImplementation,
  IRegisterOptionsWithoutImplementation,
  RegisterOptions,
} from "../register-options/i-register-options";
import { RegistrationKind } from "../registration-kind/registration-kind";
import { IDIContainer } from "./i-di-container";
import { RegistrationRecord } from "../registration-record/i-registration-record";
import { ImplementationInstance } from "../implementation/implementation";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIContainer implements IDIContainer {
  /**
   * Singleton instance of the container, for global sharing of the container.  
   */
   private static diContainer?: DIContainer;

  /**
    * Contains all maps in a object, so that Moddable can "preload" the object into flash memory.  See
    * https://github.com/Moddable-OpenSource/moddable/blob/83dadd3def6d2e7e75fc003a5ab409aa81275dd8/documentation/xs/preload.md
    * for information on Moddable preloading, but the basic concept is code that the startup code is
    * executed during the linker so that the resulting slots (variables) can be placed into flash ROM to
    * reduce the memory footprint.  By moving these maps into an object, Moddable will freeze the object
    * but allow the members (the maps) to be writable at runtime.
    */
  private readonly diMaps: {
    /**
     * A map between interface names and the services that should be dependency injected
     */
    readonly constructorArguments: Map<string, ConstructorArgument[]>;
      
    /**
     * A Map between identifying names for services and their IRegistrationRecords.
     */
    readonly serviceRegistry: Map<string, RegistrationRecord<unknown>>;

    /**
     * A map between identifying names for services and concrete instances of their implementation.
     */
    readonly instances: Map<string, unknown>;
   } = {
    constructorArguments: new Map(),
    serviceRegistry: new Map(),
    instances: new Map()
   }

  /**
   * Registers a service that will be instantiated once in the application lifecycle. All requests
   * for the service will retrieve the same instance of it.
   *
   * You should not pass any options to the method if using the compiler. It will do that automatically.
   */
  registerSingleton<T, U extends T = T>(
    newExpression: ImplementationInstance<U>,
    options: IRegisterOptionsWithoutImplementation
  ): void;
  registerSingleton<T, U extends T = T>(
    newExpression: undefined,
    options: IRegisterOptionsWithImplementation<U>
  ): void;
  registerSingleton<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void;
  registerSingleton<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void {
    if (options == null) {
      throw new ReferenceError(
        `2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`
      );
    }
    if (newExpression == null) {
      return this.register(
        "SINGLETON",
        newExpression,
        <IRegisterOptionsWithImplementation<U>>options
      );
    } else {
      return this.register("SINGLETON", newExpression, options);
    }
  }

  /**
   * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
   * This means that every call to get() will return a unique instance of the service.
   *
   * You should not pass any options to the method if using the compiler. It will do that automatically.
   */
  registerTransient<T, U extends T = T>(
    newExpression: ImplementationInstance<U>,
    options: IRegisterOptionsWithoutImplementation
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression: undefined,
    options: IRegisterOptionsWithImplementation<U>
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void;
  registerTransient<T, U extends T = T>(
    newExpression?: ImplementationInstance<U> | undefined,
    options?: RegisterOptions<U>
  ): void {
    if (options == null) {
      throw new ReferenceError(
        `2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`
      );
    }
    if (newExpression == null) {
      return this.register(
        "TRANSIENT",
        newExpression,
        <IRegisterOptionsWithImplementation<U>>options
      );
    } else {
      return this.register("TRANSIENT", newExpression, options);
    }
  }

  /**
   * Gets an instance of the service matching the interface given as a generic type parameter.
   * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
   * generic interface name.
   *
   * You should not pass any options to the method if using the compiler. It will do that automatically.
   */
  get<T>(options?: IGetOptions): T {
    if (options == null) {
      throw new ReferenceError(
        `1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`
      );
    }
    return this.constructInstance<T>(options);
  }

  /**
   * Returns true if a service has been registered matching the interface given as a generic type parameter.
   * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
   * generic interface name.
   *
   * You should not pass any options to the method if using the compiler. It will do that automatically.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  has<T>(options?: IHasOptions): boolean {
    if (options == null) {
      throw new ReferenceError(
        `1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`
      );
    }
    return this.diMaps.serviceRegistry.has(options.identifier);
  }

  /**
   * Provides a global shared instance of a container (singleton).  This is
   * especially useful when creating libraries (such as in a monorepo) where
   * the library's imported file defines the dependencies that need to be
   * injected for the library to operate without exposing the full set of
   * injections necessary for each library.
   * 
   * Example:
   * ```ts
   * DIContainer.singleton.register<MyInterface, MyImplementation>();
   * ```
   *
   * @returns Singleton container.
   */
   static get singleton(): DIContainer {
    if (!DIContainer.diContainer) DIContainer.diContainer = new DIContainer();
    return DIContainer.diContainer;
  }

  /**
   * Registers a service
   */
  private register<T, U extends T = T>(
    kind: RegistrationKind,
    newExpression: ImplementationInstance<U>,
    options: IRegisterOptionsWithoutImplementation
  ): void;
  private register<T, U extends T = T>(
    kind: RegistrationKind,
    newExpression: undefined,
    options: IRegisterOptionsWithImplementation<U>
  ): void;
  private register<T, U extends T = T>(
    kind: RegistrationKind,
    newExpression: ImplementationInstance<U> | undefined,
    options: RegisterOptions<U>
  ): void {
    // Take all of the constructor arguments for the implementation
    const implementationArguments =
      "implementation" in options &&
      options.implementation != null &&
      options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL] != null
        ? options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL]!
        : [];
    this.diMaps.constructorArguments.set(options.identifier, implementationArguments);

    this.diMaps.serviceRegistry.set(
      options.identifier,
      "implementation" in options && options.implementation != null
        ? { ...options, kind }
        : { ...options, kind, newExpression: newExpression! }
    );
  }

  /**
   * Returns true if an instance exists that matches the given identifier.
   */
  private hasInstance(identifier: string): boolean {
    return this.getInstance(identifier) != null;
  }

  /**
   * Gets the cached instance, if any, associated with the given identifier.
   */
  private getInstance<T>(identifier: string): T | null {
    const instance = this.diMaps.instances.get(identifier);
    return instance == null ? null : <T>instance;
  }

  /**
   * Gets an IRegistrationRecord associated with the given identifier.
   */
  private getRegistrationRecord<T>({
    identifier,
    parentChain,
  }: IConstructInstanceOptions): RegistrationRecord<T> {
    const record = this.diMaps.serviceRegistry.get(identifier);
    if (record == null) {
      throw new ReferenceError(
        `${
          this.constructor.name
        } could not find a service for identifier: "${identifier}". ${
          parentChain == null || parentChain.length < 1
            ? ""
            : `It is required by the service: '${parentChain
                .map((parent) => parent.identifier)
                .join(" -> ")}'.`
        } Remember to register it as a service!`
      );
    }
    return <RegistrationRecord<T>>record;
  }

  /**
   * Caches the given instance so that it can be retrieved in the future.
   */
  private setInstance<T>(identifier: string, instance: T): T {
    this.diMaps.instances.set(identifier, instance);
    return instance;
  }

  /**
   * Gets a lazy reference to another service
   */
  private getLazyIdentifier<T>(lazyPointer: () => T): T {
    return <T>(
      new Proxy({}, { get: (_, key: keyof T & string) => lazyPointer()[key] })
    );
  }

  /**
   * Constructs a new instance of the given identifier and returns it.
   * It checks the constructor arguments and injects any services it might depend on recursively.
   */
  private constructInstance<T>({
    identifier,
    parentChain = [],
  }: IConstructInstanceOptions): T {
    const registrationRecord = this.getRegistrationRecord({
      identifier,
      parentChain,
    });

    // If an instance already exists (and it is a singleton), return that one
    if (
      this.hasInstance(identifier) &&
      registrationRecord.kind === "SINGLETON"
    ) {
      return <T>this.getInstance(identifier);
    }

    // Otherwise, instantiate a new one
    let instance: T;

    const me: IParent<T> = {
      identifier,
      ref: this.getLazyIdentifier(() => instance),
    };

    // If a user-provided new-expression has been provided, invoke that to get an instance.
    if ("newExpression" in registrationRecord) {
      if (typeof registrationRecord.newExpression !== "function") {
        throw new TypeError(
          `Could not instantiate the service with the identifier: '${registrationRecord.identifier}': You provided a custom instantiation argument, but it wasn't of type function. It has to be a function that returns whatever should be used as an instance of the Service!`
        );
      }
      try {
        instance = registrationRecord.newExpression() as T;
      } catch (ex) {
        throw new Error(
          `Could not instantiate the service with the identifier: '${registrationRecord.identifier}': When you registered the service, you provided a custom instantiation function, but it threw an exception when it was run!`
        );
      }
    } else {
      // Find the arguments for the identifier
      const mappedArgs = this.diMaps.constructorArguments.get(identifier);
      if (mappedArgs == null) {
        throw new ReferenceError(
          `${this.constructor.name} could not find constructor arguments for the service: '${identifier}'. Have you registered it as a service?`
        );
      }

      // Instantiate all of the argument services (or re-use them if they were registered as singletons)
      const instanceArgs = mappedArgs.map((dep) => {
        if (dep === undefined) return undefined;
        const matchedParent = parentChain.find(
          (parent) => parent.identifier === dep
        );
        if (matchedParent != null) return matchedParent.ref;
        return this.constructInstance<T>({
          identifier: dep,
          parentChain: [...parentChain, me],
        });
      });

      try {
        // Try to construct an instance with 'new' and if it fails, call the implementation directly.
        const newable = registrationRecord.implementation as NewableService<T>;
        instance = new newable(...instanceArgs);
      } catch (ex) {
        if (registrationRecord.implementation == null) {
          throw new ReferenceError(
            `${this.constructor.name} could not construct a new service of kind: ${identifier}. Reason: No implementation was given!`
          );
        }
        const constructable = registrationRecord.implementation;
        // Try without 'new' and call the implementation as a function.
        try {
          instance = (constructable as unknown as CallableFunction)(
            ...instanceArgs
          );
        } catch {
          // throw the original error, as it is likely more descriptive than this alternative attempt
          throw ex;
        }
      }
    }

    return registrationRecord.kind === "SINGLETON"
      ? this.setInstance<T>(identifier, instance)
      : instance;
  }
}

const DI_COMPILER_ERROR_HINT = `Note: You must use DI-Compiler (https://github.com/wessberg/di-compiler) for this library to work correctly. Please consult the readme for instructions on how to install and configure it for your project.`;
