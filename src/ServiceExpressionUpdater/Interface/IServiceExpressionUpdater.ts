import {ICompilerResult} from "../../Compiler/Interface/ICompiler";
import {IClassDeclaration, IPropertyCallExpression} from "@wessberg/simplelanguageservice";

export interface IServiceExpressionUpdaterUpdateMethodOptions {
	codeContainer: ICompilerResult;
	expressions: IPropertyCallExpression[];
	classes: Map<string, IClassDeclaration>;
	mappedInterfaces: IMappedInterfaceToImplementationMap;
}

export interface IServiceExpressionUpdaterRegisterExpressionHandlerOptions {
	codeContainer: ICompilerResult;
	expression: IPropertyCallExpression;
	classes: Map<string, IClassDeclaration>;
}

export interface IMappedInterfaceToImplementationMap {
	[key: string]: string;
}

export interface IServiceExpressionUpdater {
	update (options: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap;
}