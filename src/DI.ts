import {Marshaller} from "@wessberg/marshaller";
import {SimpleLanguageService} from "@wessberg/simplelanguageservice";
import {TypeDetector} from "@wessberg/typedetector";
import MagicString from "magic-string";
import * as ts from "typescript";
import {ClassConstructorArgumentsStringifier} from "./ClassConstructorArgumentsStringifier/ClassConstructorArgumentsStringifier";
import {ClassConstructorArgumentsValidator} from "./ClassConstructorArgumentsValidator/ClassConstructorArgumentsValidator";
import {ClassDeclarationBuilder} from "./ClassDeclarationBuilder/ClassDeclarationBuilder";
import {Compiler} from "./Compiler/Compiler";
import {ICompilerResult, IHasAlteredable} from "./Compiler/Interface/ICompiler";
import {ContainerReferenceFinder} from "./ContainerReferenceFinder/ContainerReferenceFinder";
import {DIConfig} from "./DIConfig/DIConfig";
import {ServiceExpressionFinder} from "./ServiceExpressionFinder/ServiceExpressionFinder";
import {ServiceExpressionUpdater} from "./ServiceExpressionUpdater/ServiceExpressionUpdater";

export interface ICompileFileResult extends IHasAlteredable {
	code: string;
	map: string;
}

const typeDetector = new TypeDetector();
const compiler = new Compiler(
	new SimpleLanguageService(ts, {}, new Marshaller(typeDetector)),
	new ClassDeclarationBuilder(),
	new ContainerReferenceFinder(DIConfig),
	new ServiceExpressionFinder(),
	new ServiceExpressionUpdater(DIConfig, typeDetector),
	new ClassConstructorArgumentsValidator(),
	new ClassConstructorArgumentsStringifier(DIConfig)
);

/**
 * The public method of DI. This is build-tool agnostic and only cares about getting an id and some code.
 * It will upgrade the code (see the Compiler class description) and return the upgraded code and generate a sourcemap.
 * @param {string} id
 * @param {string} code
 * @returns {ICompileFileResult}
 */
export function compile (id: string, code: string): ICompileFileResult {
	const magicString = new MagicString(code);
	const codeContainer: ICompilerResult = {
		code: magicString,
		hasAltered: false
	};
	const result = compiler.compile(id, codeContainer);

	return {
		hasAltered: result.hasAltered,
		code: result.code.toString(),
		map: result.code.generateMap({
			hires: true
		})
	};
}

/**
 * Retrieves and returns a stringified map between class identifiers and their constructor arguments.
 * @returns {string}
 */
export function getClassConstructorArgumentsStringified (): string {
	return compiler.getClassConstructorArgumentsMapStringified();
}