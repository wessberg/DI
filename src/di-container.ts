import {CONSTRUCTOR_ARGUMENTS_SYMBOL, DI_COMPILER_ERROR_HINT} from "./constant.js";
import {InstantiationError} from "./error.js";

import type {
	IDIContainer,
	RegistrationRecord,
	ImplementationInstance,
	RegistrationKind,
	ConstructorArgument,
	RegisterOptionsWithoutImplementation,
	RegisterOptions,
	RegisterOptionsWithImplementation,
	GetOptions,
	HasOptions,
	ConstructInstanceOptions,
	Parent
} from "./type.js";
import {isClass, isCustomConstructableService} from "./util.js";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIContainer implements IDIContainer {
	get [Symbol.toStringTag]() {
		return "DIContainer";
	}

	/**
	 * A map between interface names and the services that should be dependency injected
	 */
	readonly #constructorArguments = new Map<string, ConstructorArgument[]>();
	/**
	 * A Map between identifying names for services and their IRegistrationRecords.
	 */
	readonly #serviceRegistry = new Map<string, RegistrationRecord<unknown>>();

	/**
	 * A map between identifying names for services and concrete instances of their implementation.
	 */
	readonly #instances = new Map<string, unknown>();

	/**
	 * Registers a service that will be instantiated once in the application lifecycle. All requests
	 * for the service will retrieve the same instance of it.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 */
	registerSingleton<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: RegisterOptionsWithoutImplementation): void;
	registerSingleton<T, U extends T = T>(newExpression: undefined, options: RegisterOptionsWithImplementation<U>): void;
	registerSingleton<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void;
	registerSingleton<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void {
		if (options == null) {
			throw new ReferenceError(`2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
		}
		if (newExpression == null) {
			return this.#register("SINGLETON", newExpression, options as RegisterOptionsWithImplementation<U>);
		} else {
			return this.#register("SINGLETON", newExpression, options);
		}
	}

	/**
	 * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
	 * This means that every call to get() will return a unique instance of the service.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 */
	registerTransient<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: RegisterOptionsWithoutImplementation): void;
	registerTransient<T, U extends T = T>(newExpression: undefined, options: RegisterOptionsWithImplementation<U>): void;
	registerTransient<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void;
	registerTransient<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void {
		if (options == null) {
			throw new ReferenceError(`2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
		}
		if (newExpression == null) {
			return this.#register("TRANSIENT", newExpression, options as RegisterOptionsWithImplementation<U>);
		} else {
			return this.#register("TRANSIENT", newExpression, options);
		}
	}

	/**
	 * Gets an instance of the service matching the interface given as a generic type parameter.
	 * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
	 * generic interface name.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 */
	get<T>(options?: GetOptions): T {
		if (options == null) {
			throw new ReferenceError(`1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
		}
		const instance = this.#constructInstance<T>(options);

		if (instance == null) {
			throw new InstantiationError(`The service wasn't found in the registry.`, {identifier: options.identifier});
		}

		return instance;
	}

	/**
	 * Returns true if a service has been registered matching the interface given as a generic type parameter.
	 * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
	 * generic interface name.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 */
	// @ts-expect-error The 'T' type parameter is required for compile-time reflection, even though it is not part of the signature.
	has<T>(options?: HasOptions): boolean {
		if (options == null) {
			throw new ReferenceError(`1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
		}
		return this.#serviceRegistry.has(options.identifier);
	}

	/**
	 * Registers a service
	 */
	#register<T, U extends T = T>(kind: RegistrationKind, newExpression: ImplementationInstance<U>, options: RegisterOptionsWithoutImplementation): void;
	#register<T, U extends T = T>(kind: RegistrationKind, newExpression: undefined, options: RegisterOptionsWithImplementation<U>): void;
	#register<T, U extends T = T>(kind: RegistrationKind, newExpression: ImplementationInstance<U> | undefined, options: RegisterOptions<U>): void {
		// Take all of the constructor arguments for the implementation
		const implementationArguments =
			"implementation" in options && options.implementation?.[CONSTRUCTOR_ARGUMENTS_SYMBOL] != null ? options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL] : [];
		this.#constructorArguments.set(options.identifier, implementationArguments);

		this.#serviceRegistry.set(
			options.identifier,
			"implementation" in options && options.implementation != null ? {...options, kind} : {...options, kind, newExpression: newExpression!}
		);
	}

	/**
	 * Returns true if an instance exists that matches the given identifier.
	 */
	#hasInstance(identifier: string): boolean {
		return this.#getInstance(identifier) != null;
	}

	/**
	 * Gets the cached instance, if any, associated with the given identifier.
	 */
	#getInstance<T>(identifier: string): T | null {
		const instance = this.#instances.get(identifier);
		return instance == null ? null : (instance as T);
	}

	/**
	 * Gets an IRegistrationRecord associated with the given identifier.
	 */
	#getRegistrationRecord<T>(identifier: string): RegistrationRecord<T> | undefined {
		return this.#serviceRegistry.get(identifier) as RegistrationRecord<T> | undefined;
	}

	/**
	 * Caches the given instance so that it can be retrieved in the future.
	 */
	#setInstance<T>(identifier: string, instance: T): T {
		this.#instances.set(identifier, instance);
		return instance;
	}

	/**
	 * Gets a lazy reference to another service
	 */
	#getLazyIdentifier<T>(lazyPointer: () => T): T {
		return new Proxy({}, {get: (_, key: keyof T & string) => lazyPointer()[key]}) as T;
	}

	/**
	 * Constructs a new instance of the given identifier and returns it.
	 * It checks the constructor arguments and injects any services it might depend on recursively.
	 */
	#constructInstance<T>({identifier, parentChain = []}: ConstructInstanceOptions): T | undefined {
		const registrationRecord = this.#getRegistrationRecord(identifier);

		if (registrationRecord == null) {
			return undefined;
		}

		// If an instance already exists (and it is a singleton), return that one
		if (this.#hasInstance(identifier) && registrationRecord.kind === "SINGLETON") {
			return this.#getInstance(identifier) as T;
		}

		// Otherwise, instantiate a new one
		let instance: T;

		const me: Parent<T> = {
			identifier,
			ref: this.#getLazyIdentifier(() => instance)
		};

		const implementation = "newExpression" in registrationRecord ? registrationRecord.newExpression : registrationRecord.implementation;

		if (isClass<T>(implementation)) {
			// Find the arguments for the identifier
			const mappedArgs = this.#constructorArguments.get(identifier);
			if (mappedArgs == null) {
				throw new InstantiationError(`Could not find constructor arguments. Have you registered it as a service?`, {identifier, parentChain});
			}

			// Instantiate all of the argument services (or re-use them if they were registered as singletons)
			const instanceArgs = mappedArgs.map(dep => {
				if (dep === undefined) return undefined;
				const matchedParent = parentChain.find(parent => parent.identifier === dep);
				if (matchedParent != null) return matchedParent.ref;
				const nextParentChain = [...parentChain, me];
				const constructedInstance = this.#constructInstance<T>({
					identifier: dep,
					parentChain: nextParentChain
				});

				if (constructedInstance == null) {
					throw new InstantiationError(`Dependency '${dep}' was not found in the service registry.`, {identifier: me.identifier, parentChain: nextParentChain});
				}

				return constructedInstance;
			});

			instance = new implementation(...instanceArgs);
		} else if (isCustomConstructableService<T>(implementation)) {
			instance = implementation();
		} else {
			throw new InstantiationError(`No implementation was given!`, {identifier, parentChain});
		}

		return registrationRecord.kind === "SINGLETON" ? this.#setInstance<T>(identifier, instance) : instance;
	}
}
