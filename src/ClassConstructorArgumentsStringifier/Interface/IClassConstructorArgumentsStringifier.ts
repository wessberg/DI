import {IMappedInterfaceToImplementationMap} from "../../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {ClassIndexer} from "@wessberg/codeanalyzer";

export interface IClassConstructorArgumentsStringifier {
	getClassConstructorArgumentsStringified (classes: ClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): string;
}