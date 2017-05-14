import {ICallExpression, ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {NodeArray, Statement} from "typescript";

export interface IServiceExpressionFinderFindMethodOptions {
	host: ICodeAnalyzer;
	statements: NodeArray<Statement>;
	identifiers: Set<string>;
	filepath: string;
}

export interface IServiceExpressionFinder {
	find (options: IServiceExpressionFinderFindMethodOptions): ICallExpression[];
}