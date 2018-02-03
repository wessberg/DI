import {IDIContainer} from "./i-di-container";
import {ConstructorArgument} from "../constructor-argument/constructor-argument";
import {IRegistrationRecord} from "../registration-record/i-registration-record";
import {RegistrationKind} from "../registration-kind/registration-kind";
import {IRegisterOptions} from "../register-options/i-register-options";
import {IGetOptions} from "../get-options/i-get-options";
import {IHasOptions} from "../has-options/i-has-options";
import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";
import {NewableService} from "../newable-service/newable-service";
import {CustomConstructableService} from "../custom-constructable-service/custom-constructable-service";
import {IConstructInstanceOptions} from "../construct-instance-options/i-construct-instance-options";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIServiceContainer implements IDIContainer {
	/**
	 * A map between interface names and the services that should be dependency injected
	 * @type {Map<string, ConstructorArgument[]>}
	 */
	private readonly constructorArguments: Map<string, ConstructorArgument[]> = new Map();
	/**
	 * A Map between identifying names for services and their IRegistrationRecords.
	 * @type {Map<string, IRegistrationRecord<{}, {}>>}
	 */
	private readonly serviceRegistry: Map<string, IRegistrationRecord<{}, {}>> = new Map();

	/**
	 * A map between identifying names for services and concrete instances of their implementation.
	 * @type {Map<string, *>}
	 */
	/*tslint:disable:no-any*/
	private readonly instances: Map<string, any> = new Map();
	/*tslint:enable:no-any*/

	/**
	 * Registers a service that will be instantiated once in the application lifecycle. All requests
	 * for the service will retrieve the same instance of it.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {() => U} [newExpression]
	 * @param {IRegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerSingleton<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void {
		return this.register(RegistrationKind.SINGLETON, newExpression, options);
	}

	/**
	 * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
	 * This means that every call to get() will return a unique instance of the service.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {() => U} [newExpression]
	 * @param {IRegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerTransient<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void {
		return this.register(RegistrationKind.TRANSIENT, newExpression, options);
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
	 * @param {IRegisterOptions<U extends T>} options
	 */
	private register<T, U extends T> (kind: RegistrationKind, newExpression?: () => U, options?: IRegisterOptions<U>): void {
		// Make sure that some options were given
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);

		// Add the constructor arguments if some were given
		if (options.constructorArguments != null) {
			this.constructorArguments.set(options.identifier, [...options.constructorArguments]);
		}
		this.serviceRegistry.set(options.identifier, {...options, kind, ...(newExpression == null ? {} : {newExpression})});
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
		return instance == null ? null : instance;
	}

	/**
	 * Gets an IRegistrationRecord associated with the given identifier.
	 * @param {string} identifier
	 * @param {string} [parent]
	 * @returns {IRegistrationRecord<T,U>}
	 */
	private getRegistrationRecord<T, U extends T> ({identifier, parent}: IConstructInstanceOptions): IRegistrationRecord<T, U> {
		const record = this.serviceRegistry.get(identifier);
		if (record == null) throw new ReferenceError(`${this.constructor.name} could not find a service for identifier: "${identifier}". ${parent == null ? "" : `It is required by the service: '${parent}'.`} Remember to register it as a service!`);
		return <IRegistrationRecord<T, U>>record;
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
	 * Constructs a new instance of the given identifier and returns it.
	 * It checks the constructor arguments and injects any services it might depend on recursively.
	 * @param {string} identifier
	 * @returns {T}
	 */
	private constructInstance<T> ({identifier, parent}: IConstructInstanceOptions): T {
		const registrationRecord = this.getRegistrationRecord({identifier, parent});

		// If an instance already exists (and it is a singleton), return that one
		if (this.hasInstance(identifier) && registrationRecord.kind === RegistrationKind.SINGLETON) {
			return <T>this.getInstance(identifier);
		}

		// Otherwise, instantiate a new one
		let instance: T;

		// If a user-provided new-expression has been provided, invoke that to get an instance.
		if (registrationRecord.newExpression != null) {
			instance = <T>registrationRecord.newExpression();
		} else {

			// Find the arguments for the identifier
			const mappedArgs = this.constructorArguments.get(identifier);
			if (mappedArgs == null) throw new ReferenceError(`${this.constructor.name} could not find constructor arguments for the service: '${identifier}'. Have you registered it as a service?`);

			// Instantiate all of the argument services (or re-use them if they were registered as singletons)
			const instanceArgs = mappedArgs.map((dep: string) => dep === undefined ? undefined : this.constructInstance<T>({identifier: dep, parent: identifier}));

			try {
				// Try to construct an instance with 'new' and if it fails, call the implementation directly.
				const newable = <NewableService<T>>registrationRecord.implementation;
				instance = new newable(...instanceArgs);
			} catch (ex) {
				if (registrationRecord.implementation == null) throw new ReferenceError(`${this.constructor.name} could not construct a new service of kind: ${identifier}. Reason: No implementation was given!`);
				const constructable = <CustomConstructableService<T>>registrationRecord.implementation;
				// Try without 'new' and call the implementation as a function.
				instance = constructable(...instanceArgs);
			}
		}
		return registrationRecord.kind === RegistrationKind.SINGLETON ? this.setInstance<T>(identifier, instance) : instance;
	}
}

// Provide access to a concrete instance of the DIServiceContainer to the outside.
/*tslint:disable*/
export const DIContainer = new DIServiceContainer();
/*tslint:enable*/