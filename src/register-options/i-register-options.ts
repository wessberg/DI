import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";
import {Implementation} from "../implementation/implementation";

export interface IRegisterOptionsBase<T> extends IContainerIdentifierable {
}

export interface IRegisterOptionsWithImplementation<T> extends IRegisterOptionsBase<T> {
	implementation: Implementation<T>|null;
}

export interface IRegisterOptionsWithoutImplementation<T> extends IRegisterOptionsBase<T> {
}

export declare type RegisterOptions<T> = IRegisterOptionsWithImplementation<T>|IRegisterOptionsWithoutImplementation<T>;