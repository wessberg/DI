import type {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "./constant.js";

export interface ContainerIdentifierable {
	identifier: string;
}
export type NewableService<T> = new (...args: any[]) => T;
export type CustomConstructableService<T> = (...args: any[]) => T;
export type ConstructorArgument = string | undefined;

export interface WithConstructorArgumentsSymbol {
	[CONSTRUCTOR_ARGUMENTS_SYMBOL]?: ConstructorArgument[];
}

export type Implementation<T> = NewableService<T> & WithConstructorArgumentsSymbol;
export type ImplementationInstance<T> = CustomConstructableService<T> & WithConstructorArgumentsSymbol;

export interface RegisterOptionsBase extends ContainerIdentifierable {}

export interface RegisterOptionsWithImplementation<T> extends RegisterOptionsBase {
	implementation: Implementation<T> | null;
}

export interface RegisterOptionsWithoutImplementation extends RegisterOptionsBase {}

export type RegisterOptions<T> = RegisterOptionsWithImplementation<T> | RegisterOptionsWithoutImplementation;
export type RegistrationKind = "SINGLETON" | "TRANSIENT";

export interface IRegistrationRecordBase {
	kind: RegistrationKind;
}

export interface RegistrationRecordWithoutImplementation<T> extends IRegistrationRecordBase, RegisterOptionsWithoutImplementation {
	kind: RegistrationKind;
	newExpression: ImplementationInstance<T>;
}

export interface RegistrationRecordWithImplementation<T> extends IRegistrationRecordBase, RegisterOptionsWithImplementation<T> {
	kind: RegistrationKind;
}

export type RegistrationRecord<T> = RegistrationRecordWithImplementation<T> | RegistrationRecordWithoutImplementation<T>;

export interface HasOptions extends ContainerIdentifierable {}
export interface GetOptions extends ContainerIdentifierable {}

export interface Parent<T> {
	identifier: string;
	ref: T;
}

export interface ConstructInstanceOptions extends ContainerIdentifierable {
	parentChain?: Parent<unknown>[];
}

export interface IDIContainer {
	registerSingleton<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void;
	registerSingleton<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: RegisterOptionsWithoutImplementation): void;
	registerSingleton<T, U extends T = T>(newExpression: undefined, options: RegisterOptionsWithImplementation<U>): void;
	registerTransient<T, U extends T = T>(newExpression?: ImplementationInstance<U>, options?: RegisterOptions<U>): void;
	registerTransient<T, U extends T = T>(newExpression: ImplementationInstance<U>, options: RegisterOptionsWithoutImplementation): void;
	registerTransient<T, U extends T = T>(newExpression: undefined, options: RegisterOptionsWithImplementation<U>): void;
	get<T>(options?: GetOptions): T;

	// @ts-expect-error The 'T' type parameter is required for compile-time reflection, even though it is not part of the signature.
	has<T>(options?: HasOptions): boolean;
}
