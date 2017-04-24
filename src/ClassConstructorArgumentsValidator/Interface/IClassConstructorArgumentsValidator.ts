import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassDeclaration} from "@wessberg/simplelanguageservice";

export interface IClassConstructorArgumentsValidator {
	validate (classes: Map<string, IClassDeclaration>, mappedInterfaces: IMappedInterfaceToImplementationMap): void;
}