import {ICompilerResult} from "../Compiler/Interface/ICompiler";
import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IGetOptions, IRegisterOptions} from "../DIContainer/Interface/IDIContainer";
import {IMappedInterfaceToImplementationMap, IServiceExpressionUpdater, IServiceExpressionUpdaterRegisterExpressionHandlerOptions, IServiceExpressionUpdaterUpdateMethodOptions} from "./Interface/IServiceExpressionUpdater";
import {ITypeDetector} from "@wessberg/typedetector";
import {IPropertyCallExpression, TypeArgument} from "@wessberg/simplelanguageservice";

/**
 * Walks through all call expressions on the DIContainer instance and upgrades their arguments.
 * @author Frederik Wessberg
 */
export class ServiceExpressionUpdater implements IServiceExpressionUpdater {
	constructor (private config: IDIConfig, private typeDetector: ITypeDetector) {}

	/**
	 * Walks through all expressions and delegates the update work to other methods in order to upgrade the code.
	 * @param {ICompilerResult} codeContainer
	 * @param {IPropertyCallExpression[]} expressions
	 * @param {Map<string, IClassDeclaration>} classes
	 * @param {IMappedInterfaceToImplementationMap} mappedInterfaces
	 */
	public update ({codeContainer, expressions, classes, mappedInterfaces}: IServiceExpressionUpdaterUpdateMethodOptions): IMappedInterfaceToImplementationMap {

		expressions.forEach(expression => {
			if (expression.method === this.config.registerTransientName || expression.method === this.config.registerSingletonName) {
				Object.assign(mappedInterfaces, this.handleRegisterExpression({codeContainer, expression, classes}));
			}

			if (expression.method === this.config.getName) {
				this.handleGetExpression(codeContainer, expression);
			}
		});
		console.log(codeContainer.code.toString());
		return mappedInterfaces;
	}

	private stringifyObject (item: TypeArgument): string {
		let str = "";
		if (this.typeDetector.isObject(item)) {
			str += "{";
			const keys = Object.keys(item);
			keys.forEach((key, index) => {
				str += `${key}: ${this.stringifyObject(<TypeArgument>item[key])}`;
				if (index !== keys.length - 1) str += ", ";
			});
			str += "}";
		} else str += `${item}`;
		return str;
	}

	/**
	 * Handles all expressions where services are registered (like registerTransient and registerSingleton)
	 * @param {ICompilerResult} codeContainer
	 * @param {IPropertyCallExpression} expression
	 * @param {Map<string, IClassDeclaration>} classes
	 */
	private handleRegisterExpression ({codeContainer, expression, classes}: IServiceExpressionUpdaterRegisterExpressionHandlerOptions): IMappedInterfaceToImplementationMap {
		const [identifier, implementation] = expression.typeArguments;
		const classDeclaration = classes.get(implementation);
		if (classDeclaration == null) throw new ReferenceError(`${this.constructor.name} could not find a class declaration for the implementation: ${implementation}`);

		const config: IRegisterOptions<string> = {
			// The identifier for the service will be the first generic argument - the interface.
			identifier: `"${identifier}"`,
			implementation: <any>implementation
		};
		codeContainer.code.appendLeft(
			expression.callBlockPosition.startsAt,
			this.stringifyObject(<any>config)
		);
		codeContainer.hasAltered = true;
		return { [identifier]: implementation };
	}

	/**
	 * Handles all expressions where services are retrieved (like get)
	 * @param {ICompilerResult} codeContainer
	 * @param {IPropertyCallExpression} expression
	 */
	private handleGetExpression (codeContainer: ICompilerResult, expression: IPropertyCallExpression): void {
		const [identifier] = expression.typeArguments;
		const config: IGetOptions = {
			identifier: `"${identifier}"`
		};

		codeContainer.code.appendLeft(
			expression.callBlockPosition.startsAt,
			this.stringifyObject(<any>config)
		);
		codeContainer.hasAltered = true;
	}

}