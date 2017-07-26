import {CustomConstructableService, IContainerIdentifierable, IDIContainer, IGetOptions, IRegisterOptions, IRegistrationRecord, NewableService, RegistrationKind} from "./Interface/IDIContainer";
import {globalObject} from "@wessberg/globalobject";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIServiceContainer implements IDIContainer {
	/**
	 * A Map between identifying names for services and their IRegistrationRecords.
	 * @type {Map<string, IRegistrationRecord<{}, {}>>}
	 */
	private serviceRegistry: Map<string, IRegistrationRecord<{}, {}>> = new Map();

	/**
	 * A map between identifying names for services and concrete instances of their implementation.
	 * @type {Map<string, *>}
	 */
	private instances: Map<string, /*tslint:disable*/any/*tslint:enable*/> = new Map();

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
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, {...options, kind: RegistrationKind.SINGLETON, ...(newExpression == null ? {} : {newExpression}) });
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
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, {...options, kind: RegistrationKind.TRANSIENT, ...(newExpression == null ? {} : {newExpression})});
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
	public has<T> (options?: IGetOptions): boolean {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No options was given!`);
		return this.serviceRegistry.has(options.identifier);
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
	 * @returns {IRegistrationRecord<T,U>}
	 */
	private getRegistrationRecord<T, U extends T> (identifier: string): IRegistrationRecord<T, U> {
		const record = this.serviceRegistry.get(identifier);
		if (record == null) throw new ReferenceError(`${this.constructor.name} could not get registration record: No implementation was found!`);
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
	private constructInstance<T> ({identifier}: IContainerIdentifierable): T {
		const registrationRecord = this.getRegistrationRecord(identifier);

		if (this.hasInstance(identifier) && registrationRecord.kind === RegistrationKind.SINGLETON) {
			return <T>this.getInstance(identifier);
		}
		let instance: T;

		// If a user-provided new-expression has been provided, invoke that to get an instance.
		if (registrationRecord.newExpression != null) {
			instance = <T>/*tslint:disable:no-inferred-empty-object-type*/registrationRecord.newExpression();/*tslint:enable:no-inferred-empty-object-type*/
		} else {

			// Try to construct an instance with 'new' and if it fails, call the implementation directly.
			const args = globalObject[<keyof Window>"___interfaceConstructorArgumentsMap___"][identifier].map((dep: string) => dep === undefined ? undefined : this.constructInstance<T>({identifier: dep}));

			try {
				const newable = <NewableService<T>>registrationRecord.implementation;
				instance = new newable(...args);
			} catch (ex) {
				if (registrationRecord.implementation == null) throw new ReferenceError(`${this.constructor.name} could not construct a new service of kind: ${identifier}. Reason: No implementation was given!`);
				const constructable = <CustomConstructableService<T>>registrationRecord.implementation;
				// Try without 'new' and call the implementation as a function.
				instance = constructable(...args);
			}
		}
		return registrationRecord.kind === RegistrationKind.SINGLETON ? this.setInstance<T>(identifier, instance) : instance;
	}
}

// Provide access to a concrete instance of the DIServiceContainer to the outside.
export const /*tslint:disable*/DIContainer/*tslint:enable*/ = new DIServiceContainer();