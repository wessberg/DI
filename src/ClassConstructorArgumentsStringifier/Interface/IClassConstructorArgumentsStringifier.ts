import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassDeclaration} from "@wessberg/simplelanguageservice";

export interface IClassConstructorArgumentsStringifier {
	getClassConstructorArgumentsStringified (classes: Map<string, IClassDeclaration>, mappedInterfaces: IMappedInterfaceToImplementationMap): string;
}