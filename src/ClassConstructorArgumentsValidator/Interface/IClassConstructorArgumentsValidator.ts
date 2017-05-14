import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {ClassIndexer} from "@wessberg/codeanalyzer";

export interface IClassConstructorArgumentsValidator {
	validate (classes: ClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): void;
}