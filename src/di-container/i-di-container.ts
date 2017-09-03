import {IRegisterOptions} from "../register-options/i-register-options";
import {IGetOptions} from "../get-options/i-get-options";
import {IHasOptions} from "../has-options/i-has-options";

export interface IDIContainer {
	registerSingleton<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void;
	registerTransient<T, U extends T> (newExpression?: () => U, options?: IRegisterOptions<U>): void;
	get<T> (options?: IGetOptions): T;
	has<T> (options?: IHasOptions): boolean;
}