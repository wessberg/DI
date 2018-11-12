import {IRegisterOptionsWithImplementation, IRegisterOptionsWithoutImplementation, RegisterOptions} from "../register-options/i-register-options";
import {IGetOptions} from "../get-options/i-get-options";
import {IHasOptions} from "../has-options/i-has-options";
import {ImplementationInstance} from "../implementation/implementation";

export interface IDIContainer {
	registerSingleton<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void;
	registerSingleton<T, U extends T = T> (newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation<U>): void;
	registerSingleton<T, U extends T = T> (newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
	registerTransient<T, U extends T = T> (newExpression?: ImplementationInstance<U>|undefined, options?: RegisterOptions<U>): void;
	registerTransient<T, U extends T = T> (newExpression: ImplementationInstance<U>, options: IRegisterOptionsWithoutImplementation<U>): void;
	registerTransient<T, U extends T = T> (newExpression: undefined, options: IRegisterOptionsWithImplementation<U>): void;
	get<T> (options?: IGetOptions): T;
	has<T> (options?: IHasOptions): boolean;
}