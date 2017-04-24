import {ICompiler, ICompilerResult} from "./Interface/ICompiler";
import {IClassDeclarationBuilder} from "../ClassDeclarationBuilder/Interface/IClassDeclarationBuilder";
import {IContainerReferenceFinder} from "../ContainerReferenceFinder/Interface/IContainerReferenceFinder";
import {IServiceExpressionFinder} from "../ServiceExpressionFinder/Interface/IServiceExpressionFinder";
import {IMappedInterfaceToImplementationMap, IServiceExpressionUpdater} from "../ServiceExpressionUpdater/Interface/IServiceExpressionUpdater";
import {IClassConstructorArgumentsStringifier} from "../ClassConstructorArgumentsStringifier/Interface/IClassConstructorArgumentsStringifier";
import {IClassConstructorArgumentsValidator} from "../ClassConstructorArgumentsValidator/Interface/IClassConstructorArgumentsValidator";
import {IClassDeclaration, ISimpleLanguageService} from "@wessberg/simplelanguageservice";
import {NodeArray, Statement} from "typescript";

/**
 * The compiler will upgrade the source code. It looks for every time a service is registered and mimics reflection.
 * Also, it tracks the constructor arguments of classes, decides if they should be dependency injected and if so the order in which
 * to do that.
 * @author Frederik Wessberg
 */
export class Compiler implements ICompiler {
	private static readonly classes: Map<string, IClassDeclaration> = new Map();
	private static readonly mappedInterfaces: IMappedInterfaceToImplementationMap = {};
	private static readonly blacklistedFilepaths: RegExp[] = [
		/node_modules\/tslib\/tslib\.[^.]*\.(js|ts)/,
		/typescript-helpers/,
		/rollup-plugin-/
	];

	constructor (private host: ISimpleLanguageService,
							 private classDeclarationBuilder: IClassDeclarationBuilder,
							 private containerReferenceFinder: IContainerReferenceFinder,
							 private serviceExpressionFinder: IServiceExpressionFinder,
							 private serviceExpressionUpdater: IServiceExpressionUpdater,
							 private classConstructorArgumentsValidator: IClassConstructorArgumentsValidator,
							 private classConstructorArgumentsStringifier: IClassConstructorArgumentsStringifier) {}

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
		if (Compiler.blacklistedFilepaths.some(path => path.test(filepath))) return { hasAltered: false, code: codeContainer.code };

		const code = codeContainer.code.toString();
		const {host} = this;
		const statements = this.register(filepath, code);

		// Tracks class declarations so we can extract their constructor arguments and decide if we should dependency inject them.
		const declarations = this.classDeclarationBuilder.build({host, statements, filepath, code});
		declarations.forEach(declaration => Compiler.classes.set(declaration.name, declaration));

		// Finds all references to the DIContainer instance.
		const identifiers = this.containerReferenceFinder.find({host, statements, filepath});

		// Finds (and validates) all expressions that has a relation to the DIContainer instance.
		const expressions = this.serviceExpressionFinder.find({host, statements, identifiers, filepath});

		// Updates all expressions.
		this.serviceExpressionUpdater.update({codeContainer, expressions, classes: Compiler.classes, mappedInterfaces: Compiler.mappedInterfaces});

		return codeContainer;
	}

	/**
	 * Registers the current file for the LanguageService which generates an AST for us to traverse.
	 * @param {string} filepath
	 * @param {string} code
	 * @returns {NodeArray<Statement>}
	 */
	private register (filepath: string, code: string): NodeArray<Statement> {
		return this.host.addFile(filepath, code);
	}

}