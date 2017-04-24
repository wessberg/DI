import {IClassDeclarationBuilder, IClassDeclarationBuilderMethodOptions} from "./Interface/IClassDeclarationBuilder";
import {IClassDeclaration} from "@wessberg/simplelanguageservice";

/**
 * Finds all class declarations in the current file.
 * @author Frederik Wessberg
 */
export class ClassDeclarationBuilder implements IClassDeclarationBuilder {

	/**
	 * Walks through the tree of statements and returns all class declarations.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {string} filepath
	 * @param {string} code
	 * @returns {IClassDeclaration[]}
	 */
	public build ({host, statements, filepath, code}: IClassDeclarationBuilderMethodOptions): IClassDeclaration[] {
		return host.getClassDeclarations(statements, filepath, code);
	}

}