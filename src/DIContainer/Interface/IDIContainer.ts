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

export interface IRegistrationRecord<T, U extends T> extends IRegisterOptions<T>, IContainerIdentifierable {
	kind: RegistrationKind;
	newExpression? (): U;
}

export declare type ConstructorArgument = /*tslint:disable*/any/*tslint:enable*/;

export interface IDIContainer {
	registerSingleton<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void;
	registerTransient<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void;
	get<T> (options?: IGetOptions): T;
	has<T> (options?: IGetOptions): boolean;
}