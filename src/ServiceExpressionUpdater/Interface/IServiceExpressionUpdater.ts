import {ICompilerResult} from "../../Compiler/Interface/ICompiler";
import {ClassIndexer, ICallExpression} from "@wessberg/codeanalyzer";

export interface IServiceExpressionUpdaterUpdateMethodOptions {
	codeContainer: ICompilerResult;
	expressions: ICallExpression[];
	classes: ClassIndexer;
	mappedInterfaces: IMappedInterfaceToImplementationMap;
}

export interface IServiceExpressionUpdaterRegisterExpressionHandlerOptions {
	codeContainer: ICompilerResult;
	expression: ICallExpression;
	classes: ClassIndexer;
}

export interface IMappedInterfaceToImplementationMap {
	[key: string]: string;
}

export interface IServiceExpressionUpdater {
	update (options: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap;
}