declare const CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER = "___CTOR_ARGS___";
declare const CONSTRUCTOR_ARGUMENTS_SYMBOL: unique symbol;
type ConstructorArgument = string | undefined;
interface IWithConstructorArgumentsSymbol {
    [CONSTRUCTOR_ARGUMENTS_SYMBOL]?: ConstructorArgument[];
}
interface IContainerIdentifierable {
    identifier: string;
}
interface IGetOptions extends IContainerIdentifierable {
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NewableService<T> = new (...args: any[]) => T;
/* eslint-disable @typescript-eslint/no-explicit-any */
type CustomConstructableService<T> = (...args: any[]) => T;
type Implementation<T> = NewableService<T> & IWithConstructorArgumentsSymbol;
type ImplementationInstance<T> = CustomConstructableService<T> & IWithConstructorArgumentsSymbol;
interface IRegisterOptionsBase extends IContainerIdentifierable {
}
interface IRegisterOptionsWithImplementation<T> extends IRegisterOptionsBase {
    implementation: Implementation<T> | null;
}
interface IRegisterOptionsWithoutImplementation extends IRegisterOptionsBase {
}
type RegisterOptions<T> = IRegisterOptionsWithImplementation<T> | IRegisterOptionsWithoutImplementation;
interface IHasOptions extends IContainerIdentifierable {
}
interface IDIContainer {
    registerSingleton<T, U extends T = T>(newExpression?: ImplementationInstance<U> | undefined, options?: RegisterOptions<U>): void;
    registerSingleton<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation): void;
    registerSingleton<T, U extends T = T>(newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
    registerTransient<T, U extends T = T>(newExpression?: ImplementationInstance<U> | undefined, options?: RegisterOptions<U>): void;
    registerTransient<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation): void;
    registerTransient<T, U extends T = T>(newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
    get<T>(options?: IGetOptions): T;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    has<T>(options?: IHasOptions): boolean;
}
/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
declare class DIContainer implements IDIContainer {
    /**
     * Registers a service that will be instantiated once in the application lifecycle. All requests
     * for the service will retrieve the same instance of it.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    registerSingleton<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation): void;
    registerSingleton<T, U extends T = T>(newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
    registerSingleton<T, U extends T = T>(newExpression?: ImplementationInstance<U> | undefined, options?: RegisterOptions<U>): void;
    /**
     * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
     * This means that every call to get() will return a unique instance of the service.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    registerTransient<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation): void;
    registerTransient<T, U extends T = T>(newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
    registerTransient<T, U extends T = T>(newExpression?: ImplementationInstance<U> | undefined, options?: RegisterOptions<U>): void;
    /**
     * Gets an instance of the service matching the interface given as a generic type parameter.
     * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
     * generic interface name.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    get<T>(options?: IGetOptions): T;
    /**
     * Returns true if a service has been registered matching the interface given as a generic type parameter.
     * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
     * generic interface name.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    has<T>(options?: IHasOptions): boolean;
    /**
     * Registers a service
     */
    private register;
    /**
     * Returns true if an instance exists that matches the given identifier.
     */
    private hasInstance;
    /**
     * Gets the cached instance, if any, associated with the given identifier.
     */
    private getInstance;
    /**
     * Gets an IRegistrationRecord associated with the given identifier.
     */
    private getRegistrationRecord;
    /**
     * Caches the given instance so that it can be retrieved in the future.
     */
    private setInstance;
    /**
     * Gets a lazy reference to another service
     */
    private getLazyIdentifier;
    /**
     * Constructs a new instance of the given identifier and returns it.
     * It checks the constructor arguments and injects any services it might depend on recursively.
     */
    private constructInstance;
    /**
     * Maps that may get defined during Moddable pre-load, and then frozen into flash memory.  See the getter
     * `diContainerMaps` which handles the transition from flash to runtime for the maps.
     */
    private readonly writableDiContainerMaps;
    /**
     * Getter that provides access to the various maps.  Handles cloning the maps from the read-only preload condition
     * to a writable runtime version to support Moddable preloads.
     */
    private get diContainerMaps();
}
export { ConstructorArgument, IGetOptions, RegisterOptions, IHasOptions, DIContainer, IDIContainer, CONSTRUCTOR_ARGUMENTS_SYMBOL, CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER };
