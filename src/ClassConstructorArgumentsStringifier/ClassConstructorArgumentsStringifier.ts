import {IClassConstructorArgumentsStringifier} from "./Interface/IClassConstructorArgumentsStringifier";
import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IMappedInterfaceToImplementationMap} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassDeclaration, IConstructorArgument} from "@wessberg/simplelanguageservice";

/**
 * This class generates a stringified map between classes and the services that their constructors depend on.
 * @author Frederik Wessberg
 */
export class ClassConstructorArgumentsStringifier implements IClassConstructorArgumentsStringifier {
	constructor (private config: IDIConfig) {}

	/**
	 * This method will generate a stringified map between service interfaces and the (ordered) identifiers for services that should be dependency injected upon their
	 * corresponding implementations constructors upon instantiation.
	 * @param {Map<string, IClassDeclaration>} classes
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 * @returns {string}
	 */
	public getClassConstructorArgumentsStringified (classes: Map<string, IClassDeclaration>, mappedInterfaces: IMappedInterfaceToImplementationMap): string {
		let map = `const ${this.config.interfaceConstructorArgumentsMapName} = {\n`;
		const keys = Object.keys(mappedInterfaces);
		const entries = [...classes.entries()];

		keys.forEach((key, index) => {
			const classDeclaration = classes.get(mappedInterfaces[key]);
			if (classDeclaration == null) throw new ReferenceError(`${this.constructor.name} could not get class constructor arguments: The interface "${key}" had no matching class implementation. Have you registered it as a service?`);

			map += `\t${key}: `;
			map += `[${classDeclaration.constructorArguments.map(ctorArg => this.normalizeConstructorArgument(ctorArg, mappedInterfaces)).join(", ")}]`;
			if (index !== entries.length - 1) map += ",";
			map += "\n";
		});
		map += "};";
		console.log(map);
		return map;
	}

	/**
	 * Normalizes an argument to pass to the instantiation of a service. If the type of the argument is unknown or not defined,
	 * we insert "undefined" as value.
	 * @param {IConstructorArgument} constructorArgument
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 * @returns {string}
	 */
	private normalizeConstructorArgument (constructorArgument: IConstructorArgument, mappedInterfaces: IMappedInterfaceToImplementationMap): string {
		if (constructorArgument.type == null || mappedInterfaces[constructorArgument.type] == null) return "undefined";
		return `"${constructorArgument.type}"`;
	}

}