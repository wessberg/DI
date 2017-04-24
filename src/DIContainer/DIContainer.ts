import {IContainerIdentifierable, IDIContainer, IGetOptions, IRegisterOptions, IRegistrationRecord, RegistrationKind} from "./Interface/IDIContainer";
import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {DIConfig} from "../DIConfig/DIConfig";
import {GlobalObject} from "@wessberg/globalobject";

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
export class DIServiceContainer implements IDIContainer {
	private serviceRegistry: Map<string, IRegistrationRecord<{}>> = new Map();
	private instances: Map<string, any> = new Map();

	constructor (private config: IDIConfig) {}

	/**
	 * Registers a service that will be instantiated once in the application lifecycle. All requests
	 * for the service will retrieve the same instance of it.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {IRegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerSingleton<T, U extends T> (options?: IRegisterOptions<U>): void {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, {...options, ...{kind: RegistrationKind.SINGLETON}});
	}

	/**
	 * Registers a service that will be instantiated every time it is requested throughout the application lifecycle.
	 * This means that every call to get() will return a unique instance of the service.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {IRegisterOptions<U>} [options]
	 * @returns {void}
	 */
	public registerTransient<T, U extends T> (options?: IRegisterOptions<U>): void {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not register service: No options was given!`);
		this.serviceRegistry.set(options.identifier, {...options, ...{kind: RegistrationKind.TRANSIENT}});
	}

	/**
	 * Gets an instance of the service matching the interface given as a generic type parameter.
	 * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
	 * generic interface name.
	 *
	 * You should not pass any options to the method if using the compiler. It will do that automatically.
	 * @param {IRegisterOptions<U>} [options]
	 * @returns {T}
	 */
	public get<T> (options?: IGetOptions): T {
		if (options == null) throw new ReferenceError(`${this.constructor.name} could not get service: No options was given!`);
		return this.constructInstance<T>(options);
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
	private getInstance<T> (identifier: string): T | null {
		const instance = this.instances.get(identifier);
		return instance == null ? null : instance;
	}

	/**
	 * Gets an IRegistrationRecord associated with the given identifier.
	 * @param {string} identifier
	 * @returns {IRegistrationRecord<T>}
	 */
	private getRegistrationRecord<T> (identifier: string): IRegistrationRecord<T> {
		const record = this.serviceRegistry.get(identifier);
		if (record == null) throw new ReferenceError(`${this.constructor.name} could not get registration record: No implementation was found!`);
		return <IRegistrationRecord<T>>record;
	}

	/**
	 * Caches the given instance so that it can be retrieved in the future.
	 * @param {string} identifier
	 * @param {T} instance
	 * @returns {T}
	 */
	private setInstance<T> (identifier: string, instance: T): T {
		this.instances.set(identifier, instance);
		return <T>instance;
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

		const instance = <T>new registrationRecord.implementation(...GlobalObject[<keyof Window>this.config.interfaceConstructorArgumentsMapName][identifier].map((dep: string) => dep === undefined ? undefined : this.constructInstance({identifier: dep})));
		return registrationRecord.kind === RegistrationKind.SINGLETON ? this.setInstance<T>(identifier, instance) : instance;
	}
}

// Only provide access to a concrete instance of the DIServiceContainer to the outside.
export const DIContainer = new DIServiceContainer(DIConfig);