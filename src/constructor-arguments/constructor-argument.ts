import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "./constructor-arguments-identifier";

export type ConstructorArgument = string|undefined;
export interface IWithConstructorArgumentsSymbol {
	[CONSTRUCTOR_ARGUMENTS_SYMBOL]?: ConstructorArgument[];
}