import {IConstructInstanceOptions} from "../construct-instance-options/i-construct-instance-options";
import {IParent} from "../construct-instance-options/i-parent";
import {ConstructorArgument} from "../constructor-arguments/constructor-argument";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "../constructor-arguments/constructor-arguments-identifier";
import {IGetOptions} from "../get-options/i-get-options";
import {IHasOptions} from "../has-options/i-has-options";
import {NewableService} from "../newable-service/newable-service";
import {IRegisterOptionsWithImplementation, IRegisterOptionsWithoutImplementation, RegisterOptions} from "../register-options/i-register-options";
import {RegistrationKind} from "../registration-kind/registration-kind";
import {IDIContainer} from "./i-di-container";
import {RegistrationRecord} from "../registration-record/i-registration-record";
import {ImplementationInstance} from "../implementation/implementation";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIContainer implements IDIContainer {
	/**
	 * A map between interface names and the services that should be dependency injected
	 * @type {Map<string, ConstructorArgument[]>}
	 */
	private readonly constructorArguments: Map<string, ConstructorArgument[]> = new Map();
	/**
	 * A Map between identifying names for services and their IRegistrationRecords.
	 * @type {Map<string, RegistrationRecord<{}, {}>>}
	 */
	private readonly serviceRegistry: Map<string, RegistrationRecord<{}>> = new Map();

	/**
	 * A map between identifying names for services and concrete instances of their implementation.
	 * @type {Map<string, *>}
	 */
	private readonly instances: Map<string, {}> = new Map();

	/**
	 * Registers a service that will be instantiated once in the application lifecycle. All requests
	 * for the service will retrieve the same instance of it.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {() => U} [newExpression]
	 * @param {RegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerSingleton<T, U extends T = T> (newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation<U>): void;
	public registerSingleton<T, U extends T = T> (newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
	public registerSingleton<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void;
	public registerSingleton<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No arguments were given!`);
		if (newExpression == null) {
			return this.register(RegistrationKind.SINGLETON, newExpression, <IRegisterOptionsWithImplementation<U>> options);
		}
		else {
			return this.register(RegistrationKind.SINGLETON, newExpression, options);
		}
	}

	/**
	 * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
	 * This means that every call to get() will return a unique instance of the service.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {() => U} [newExpression]
	 * @param {RegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerTransient<T, U extends T = T> (newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation<U>): void;
	public registerTransient<T, U extends T = T> (newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
	public registerTransient<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void;
	public registerTransient<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No arguments were given!`);
		if (newExpression == null) {
			return this.register(RegistrationKind.TRANSIENT, newExpression, <IRegisterOptionsWithImplementation<U>> options);
		}
		else {
			return this.register(RegistrationKind.TRANSIENT, newExpression, options);
		}
	}

	/**
	 * Gets an instance of the service matching the interface given as a generic type parameter.
	 * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
	 * generic interface name.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {IGetOptions} [options]
	 * @returns {T}
	 */
	public get<T> (options?: IGetOptions): T {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No options was given!`);
		return this.constructInstance<T>(options);
	}

	/**
	 * Returns true if a service has been registered matching the interface given as a generic type parameter.
	 * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
	 * generic interface name.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {IGetOptions} [options]
	 * @returns {boolean}
	 */
	public has<T> (options?: IHasOptions): boolean {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No options was given!`);
		return this.serviceRegistry.has(options.identifier);
	}

	/**
	 * Registers a service
	 * @param {RegistrationKind} kind
	 * @param {() => U} newExpression
	 * @param {RegisterOptions<U extends T>} options
	 */
	private register<T, U extends T = T> (kind: RegistrationKind, newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation<U>): void;
	private register<T, U extends T = T> (kind: RegistrationKind, newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
	private register<T, U extends T = T> (kind: RegistrationKind, newExpression: ImplementationInstance<U>|undefined, options: RegisterOptions<U>): void {

		// Take all of the constructor arguments for the implementation
		const implementationArguments = "implementation" in options && options.implementation != null && options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL] != null ? options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL]! : [];
		this.constructorArguments.set(options.identifier, implementationArguments);

		this.serviceRegistry.set(
			options.identifier,
			"implementation" in options && options.implementation != null
				? {...options, kind}
				: {...options, kind, newExpression: newExpression!}
		);
	}

	/**
	 * Returns true if an instance exists that matches the given identifier.
	 * @param {string} identifier
	 * @returns {boolean}
	 */
	private hasInstance (identifier: string): boolean {
		return this.getInstance(identifier) != null;
	}

	/**
	 * Gets the cached instance, if any, associated with the given identifier.
	 * @param {string} identifier
	 * @returns {T|null}
	 */
	private getInstance<T> (identifier: string): T|null {
		const instance = this.instances.get(identifier);
		return instance == null ? null : <T> instance;
	}

	/**
	 * Gets an IRegistrationRecord associated with the given identifier.
	 * @param {string} identifier
	 * @param {string} [parent]
	 * @returns {RegistrationRecord<T>}
	 */
	private getRegistrationRecord<T> ({identifier, parentChain}: IConstructInstanceOptions<T>): RegistrationRecord<T> {
		const record = this.serviceRegistry.get(identifier);
		if (record == null) throw new ReferenceError(`${this.constructor.name} could not find a service for identifier: "${identifier}". ${parentChain == null || parentChain.length < 1 ? "" : `It is required by the service: '${parentChain.map(parent => parent.identifier).join(" -> ")}'.`} Remember to register it as a service!`);
		return <RegistrationRecord<T>> record;
	}

	/**
	 * Caches the given instance so that it can be retrieved in the future.
	 * @param {string} identifier
	 * @param {T} instance
	 * @returns {T}
	 */
	private setInstance<T> (identifier: string, instance: T): T {
		this.instances.set(identifier, instance);
		return instance;
	}

	/**
	 * Gets a lazy reference to another service
	 * @param lazyPointer
	 */
	private getLazyIdentifier<T> (lazyPointer: () => T): T {
		return <T> new Proxy({}, {get: (_, key: keyof T) => lazyPointer()[key]});
	}

	/**
	 * Constructs a new instance of the given identifier and returns it.
	 * It checks the constructor arguments and injects any services it might depend on recursively.
	 * @param {IConstructInstanceOptions<T>} options
	 * @returns {T}
	 */
	private constructInstance<T> ({identifier, parentChain = []}: IConstructInstanceOptions<T>): T {
		const registrationRecord = this.getRegistrationRecord({identifier, parentChain});

		// If an instance already exists (and it is a singleton), return that one
		if (this.hasInstance(identifier) && registrationRecord.kind === RegistrationKind.SINGLETON) {
			return <T>this.getInstance(identifier);
		}

		// Otherwise, instantiate a new one
		let instance: T;

		const me: IParent<T> = {
			identifier,
			ref: this.getLazyIdentifier(() => instance)
		};

		// If a user-provided new-expression has been provided, invoke that to get an instance.
		if ("newExpression" in registrationRecord) {
			if (typeof registrationRecord.newExpression !== "function") {
				throw new TypeError(`Could not instantiate the service with the identifier: '${registrationRecord.identifier}': You provided a custom instantiation argument, but it wasn't of type function. It has to be a function that returns whatever should be used as an instance of the Service!`);
			}
			try {
				instance = <T> registrationRecord.newExpression();
			} catch (ex) {
				throw new Error(`Could not instantiate the service with the identifier: '${registrationRecord.identifier}': When you registered the service, you provided a custom instantiation function, but it threw an exception when it was run!`);
			}
		}
		else {

			// Find the arguments for the identifier
			const mappedArgs = this.constructorArguments.get(identifier);
			if (mappedArgs == null) throw new ReferenceError(`${this.constructor.name} could not find constructor arguments for the service: '${identifier}'. Have you registered it as a service?`);

			// Instantiate all of the argument services (or re-use them if they were registered as singletons)
			const instanceArgs = mappedArgs.map((dep: string) => {
				if (dep === undefined) return undefined;
				const matchedParent = parentChain.find(parent => parent.identifier === dep);
				if (matchedParent != null) return matchedParent.ref;
				return this.constructInstance<T>({identifier: dep, parentChain: [...parentChain, me]});
			});

			try {
				// Try to construct an instance with 'new' and if it fails, call the implementation directly.
				const newable = <NewableService<T>>registrationRecord.implementation;
				instance = new newable(...instanceArgs);
			} catch (ex) {
				if (registrationRecord.implementation == null) throw new ReferenceError(`${this.constructor.name} could not construct a new service of kind: ${identifier}. Reason: No implementation was given!`);
				const constructable = registrationRecord.implementation;
				// Try without 'new' and call the implementation as a function.
				instance = constructable(...instanceArgs);
			}
		}

		return registrationRecord.kind === RegistrationKind.SINGLETON ? this.setInstance<T>(identifier, instance) : instance;
	}
}