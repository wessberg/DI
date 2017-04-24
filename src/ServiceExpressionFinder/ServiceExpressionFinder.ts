import {IServiceExpressionFinder, IServiceExpressionFinderFindMethodOptions} from "./Interface/IServiceExpressionFinder";
import {IPropertyCallExpression} from "@wessberg/simplelanguageservice";

/**
 * Finds all expressions in the given statements related to the DIContainer.
 * @author Frederik Wessberg
 */
export class ServiceExpressionFinder implements IServiceExpressionFinder {

	/**
	 * Traverses the AST and extracts all CallExpressions that has to do with the DIContainer.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {Set<string>} identifiers
	 * @param {string} filepath
	 * @returns {IPropertyCallExpression[]}
	 */
	public find ({host, statements, identifiers, filepath}: IServiceExpressionFinderFindMethodOptions): IPropertyCallExpression[] {
		const expressions = host.getPropertyCallExpressions(statements);
		return expressions.filter(exp => identifiers.has(this.assertNoArguments(exp, filepath).property));
	}

	private assertNoArguments (expression: IPropertyCallExpression, filepath: string): IPropertyCallExpression {
		if (expression.args.length === 0) return expression;

		const formattedExpression = `${expression.property}.${expression.method}<${expression.typeArguments.join(", ")}>(${expression.args.map(arg => arg.value).join(", ")})`;

		if (expression.typeArguments.length < 2) {
			throw new TypeError(`Found an issue in ${filepath}: You must pass an implementation as the second generic type parameter here: ${formattedExpression}`);
		}

		if (expression.args.length > 0) {
			throw new TypeError(`Found an issue in ${filepath}: You shouldn't pass any arguments here: ${formattedExpression}. Instead, let the compiler do it for you.`);
		}
		return expression;
	}

}