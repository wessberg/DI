import {ICompiler, ICompilerResult} from "./Interface/ICompiler";
import {IContainerReferenceFinder} from "../ContainerReferenceFinder/Interface/IContainerReferenceFinder";
import {IServiceExpressionFinder} from "../ServiceExpressionFinder/Interface/IServiceExpressionFinder";
import {IMappedInterfaceToImplementationMap, IServiceExpressionUpdater} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassConstructorArgumentsStringifier} from "../ClassConstructorArgumentsStringifier/Interface/IClassConstructorArgumentsStringifier";
import {IClassConstructorArgumentsValidator} from "../ClassConstructorArgumentsValidator/Interface/IClassConstructorArgumentsValidator";
import {ClassIndexer, ICodeAnalyzer} from "@wessberg/codeanalyzer";

/**
 * The compiler will upgrade the source code. It looks for every time a service is registered and mimics reflection.
 * Also, it tracks the constructor arguments of classes, decides if they should be dependency injected and if so the order in which
 * to do that.
 * @author Frederik Wessberg
 */
export class Compiler implements ICompiler {
	private static classes: ClassIndexer;
	private static readonly mappedInterfaces: IMappedInterfaceToImplementationMap = {};
	private static readonly blacklistedFilepaths: RegExp[] = [
		/node_modules\/tslib\/tslib\.[^.]*\.(js|ts)/,
		/typescript-helpers/,
		/rollup-plugin-/
	];

	constructor (private host: ICodeAnalyzer,
							 private containerReferenceFinder: IContainerReferenceFinder,
							 private serviceExpressionFinder: IServiceExpressionFinder,
							 private serviceExpressionUpdater: IServiceExpressionUpdater,
							 private classConstructorArgumentsValidator: IClassConstructorArgumentsValidator,
							 private classConstructorArgumentsStringifier: IClassConstructorArgumentsStringifier) {
	}

	/**
	 * Validates that all constructor references to services are actually being registered as services
	 * before then moving on to generating a map between class/service identifiers and the ordered dependencies
	 * that should be dependency injected. It returns a map so that it can be added to the top of a code bundle.
	 * @returns {string}
	 */
	public getClassConstructorArgumentsMapStringified (): string {
		this.classConstructorArgumentsValidator.validate(Compiler.classes, Compiler.mappedInterfaces);
		return this.classConstructorArgumentsStringifier.getClassConstructorArgumentsStringified(Compiler.classes, Compiler.mappedInterfaces);
	}

	/**
	 * The consumable method that upgrades the code as per the class description.
	 * @param {string} filepath
	 * @param {ICompilerResult} codeContainer
	 * @returns {ICompilerResult}
	 */
	public compile (filepath: string, codeContainer: ICompilerResult): ICompilerResult {
		if (Compiler.blacklistedFilepaths.some(path => path.test(filepath))) return {hasAltered: false, code: codeContainer.code};

		const code = codeContainer.code.toString();
		const {host} = this;
		const statements = host.addFile(filepath, code);

		// Tracks class declarations so we can extract their constructor arguments and decide if we should dependency inject them.
		Compiler.classes = host.getClassDeclarations(statements, true);

		// Finds all references to the DIContainer instance.
		const identifiers = this.containerReferenceFinder.find({host, statements});

		// Finds (and validates) all expressions that has a relation to the DIContainer instance.
		const expressions = this.serviceExpressionFinder.find({host, statements, identifiers, filepath});

		// Updates all expressions.
		this.serviceExpressionUpdater.update({codeContainer, expressions, classes: Compiler.classes, mappedInterfaces: Compiler.mappedInterfaces});

		return codeContainer;
	}
}