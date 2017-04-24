import {IPropertyCallExpression, ISimpleLanguageService} from "@wessberg/simplelanguageservice";
import {NodeArray, Statement} from "typescript";

export interface IServiceExpressionFinderFindMethodOptions {
	host: ISimpleLanguageService;
	statements: NodeArray<Statement>;
	identifiers: Set<string>;
	filepath: string;
}

export interface IServiceExpressionFinder {
	find (options: IServiceExpressionFinderFindMethodOptions): IPropertyCallExpression[];
}