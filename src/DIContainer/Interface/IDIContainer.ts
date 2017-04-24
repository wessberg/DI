export interface IContainerIdentifierable {
	identifier: string;
}

export interface IImplementationable<T> {
	implementation: new (...args: ConstructorArgument[]) => T;
}

export interface IRegisterOptions<T> extends IContainerIdentifierable, IImplementationable<T> {
}

export interface IGetOptions extends IContainerIdentifierable {
}

export enum RegistrationKind {
	SINGLETON, TRANSIENT
}

export interface IRegistrationRecord<T> extends IRegisterOptions<T>, IContainerIdentifierable {
	kind: RegistrationKind;
}

export declare type ConstructorArgument = any;

export interface IDIContainer {
	registerSingleton<T, U extends T> (options?: IRegisterOptions<U>): void;
	registerTransient<T, U extends T> (options?: IRegisterOptions<U>): void;
	get<T> (options?: IGetOptions): T;
}