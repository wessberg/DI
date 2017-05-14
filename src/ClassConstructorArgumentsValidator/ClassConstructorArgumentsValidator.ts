import {IClassConstructorArgumentsValidator} from "./Interface/IClassConstructorArgumentsValidator";
import {IMappedInterfaceToImplementationMap} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {ClassIndexer} from "@wessberg/codeanalyzer";

/**
 * Validates that any class that expects a service as constructor argument either registers the service or initializes
 * the value directly from the constructor. This brings compile-time validation to the DI-system.
 * @author Frederik Wessberg
 */
export class ClassConstructorArgumentsValidator implements IClassConstructorArgumentsValidator {

	/**
	 * Checks each argument and validates it as described in the class description.
	 * @param {ClassIndexer} classes
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 */
	public validate (classes: ClassIndexer, mappedInterfaces: IMappedInterfaceToImplementationMap): void {
		Object.keys(classes).forEach(key => {
			const declaration = classes[key];
			if (declaration.constructor == null) return;

			declaration.constructor.parameters.parametersList.forEach((parameter, index) => {
				if (parameter.type.flattened == null && parameter.value.expression == null) {
					// If neither type nor initializer is given, throw an error. We must know if the argument should be dependency injected.
					throw new TypeError(`${this.constructor.name} could not validate the class: ${declaration.name}: The constructor argument "${parameter.name}" on argument position ${index} had no type declaration and no initializer. You must either give it a type so it can be dependency injected or initialize it yourself to a value!`);
				}

				if (parameter.type.flattened != null && parameter.value.expression == null && mappedInterfaces[parameter.type.flattened] == null) {
					// If it has a declared type that isn't initialized and that isn't registered as a service, throw an error.
					throw new ReferenceError(`${this.constructor.name} could not validate the class: ${declaration.name}: The constructor argument: "${parameter.name}" on argument position ${index} could not be found. Remember to register it as a service or initialize it to a value from the argument position!`);
				}
			});
		});

	}

}