import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";
import {NewableService} from "../newable-service/newable-service";
import {CustomConstructableService} from "../custom-constructable-service/custom-constructable-service";
import {ConstructorArgument} from "../constructor-arguments/constructor-argument";

export interface IRegisterOptions<T> extends IContainerIdentifierable {
	implementation: NewableService<T>|CustomConstructableService<T>|null;
	constructorArguments?: Iterable<ConstructorArgument>|null;
}