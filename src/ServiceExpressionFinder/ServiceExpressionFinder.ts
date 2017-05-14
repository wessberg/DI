import {IServiceExpressionFinder, IServiceExpressionFinderFindMethodOptions} from "./Interface/IServiceExpressionFinder";
import {ICallExpression} from "@wessberg/codeanalyzer";

/**
 * Finds all expressions in the given statements related to the DIContainer.
 * @author Frederik Wessberg
 */
export class ServiceExpressionFinder implements IServiceExpressionFinder {

	/**
	 * Traverses the AST and extracts all CallExpressions that has to do with the DIContainer.
	 * @param host
	 * @param statements
	 * @param {Set<string>} identifiers
	 * @param {string} filepath
	 * @returns {ICallExpression[]}
	 */
	public find ({host, statements, identifiers, filepath}: IServiceExpressionFinderFindMethodOptions): ICallExpression[] {
		const expressions = host.getCallExpressions(statements);
		return expressions.filter(exp => {
			this.assertNoArguments(exp, filepath).property;
			return exp.property != null && identifiers.has(exp.property.toString());
		});
	}

	private assertNoArguments (expression: ICallExpression, filepath: string): ICallExpression {
		if (expression.arguments.argumentsList.length === 0) return expression;
		const formattedExpression = `${expression.property}.${expression.identifier}<${expression.type.flattened}>(${expression.arguments.argumentsList.map(arg => arg.value.hasDoneFirstResolve() ? arg.value.resolved : arg.value.resolve()).join(", ")})`;

		if (expression.type.bindings == null || expression.type.bindings.length < 2) {
			throw new TypeError(`Found an issue in ${filepath}: You must pass an implementation as the second generic type parameter here: ${formattedExpression}`);
		}

		if (expression.arguments.argumentsList.length > 0) {
			throw new TypeError(`Found an issue in ${filepath}: You shouldn't pass any arguments here: ${formattedExpression}. Instead, let the compiler do it for you.`);
		}
		return expression;
	}

}