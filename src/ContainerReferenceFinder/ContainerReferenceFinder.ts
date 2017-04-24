import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IContainerReferenceFinder, IContainerReferenceFinderFindMethodOptions} from "./Interface/IContainerReferenceFinder";

/**
 * Tracks any reference to the DIContainer in specific files, taking into account any potential local or
 * imported/exported aliases for the DIContainer instance.
 * @author Frederik Wessberg
 */
export class ContainerReferenceFinder implements IContainerReferenceFinder {
	private static readonly exportedAliases: Set<string> = new Set();
	constructor (private config: IDIConfig) {}

	/**
	 * Parses the file for existing or new references to the DIContainer and returns them as a Set.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {string} filepath
	 * @returns {Set<string>}
	 */
	public find ({host, statements, filepath}: IContainerReferenceFinderFindMethodOptions): Set<string> {

		// Find variables that are assigned to the DIContainer
		const assignedTo = this.findMatchingIdentifiers({host, statements, filepath}, ContainerReferenceFinder.exportedAliases);

		// Track these variables, in case they are exported for consumption of other modules
		const exportedAliases = [...assignedTo].filter(alias => this.isAliasExported({host, statements, filepath}, alias));
		exportedAliases.forEach(alias => ContainerReferenceFinder.exportedAliases.add(alias));

		// Assert that the DIContainer or one of its aliases are actually being imported.
		const matchingImports = this.findImports({host, statements, filepath}, ContainerReferenceFinder.exportedAliases);

		// Construct a Set of all identifiers for the container in the local scope of this file.
		return new Set([...assignedTo, ...matchingImports]);
	}

	/**
	 * Decides if an identifier matches the name of the DIContainer or any of the given aliases.
	 * @param {string} identifier
	 * @param {Set<string>} aliases
	 * @returns {boolean}
	 */
	private isRelevantIdentifier (identifier: string, aliases: Set<string>): boolean {
		return identifier === this.config.exportName || aliases.has(identifier);
	}

	/**
	 * Checks the imports of the current file for the identifier for the DIContainer or one of its aliases.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {string} filepath
	 * @param {Set<string>} aliases
	 * @returns {Set<string>}
	 */
	private findImports ({host, statements, filepath}: IContainerReferenceFinderFindMethodOptions, aliases: Set<string>): Set<string> {
		const importDeclarations = host.getImportDeclarations(statements, filepath)
			// Take only the import declarations that contains relevant bindings
			.filter(declaration => declaration.bindings
				.find(binding => this.isRelevantIdentifier(binding, aliases)) != null);

		const set: Set<string> = new Set();

		// Take the individual bound identifiers and add them to the set.
		importDeclarations.forEach(importDeclaration => {
			importDeclaration.bindings.forEach(binding => {
				if (this.isRelevantIdentifier(binding, aliases)) set.add(binding);
			})
		});
		return set;
	}

	/**
	 * Checks if an alias for the DIContainer is being exported by the current file.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {string} alias
	 * @returns {boolean}
	 */
	private isAliasExported ({host, statements}: IContainerReferenceFinderFindMethodOptions, alias: string): boolean {
		const exportIdentifiers = host.getExportDeclarations(statements);
		return exportIdentifiers.has(alias);
	}

	/**
	 * Finds any variable assignments that binds to the DIContainer or any of its aliases.
	 * These become new aliases. We simply try our best at tracking all references to the concrete instance.
	 * @param {LanguageService} host
	 * @param {NodeArray<Statement>} statements
	 * @param {Set<string>} aliases
	 * @returns {Set<string>}
	 */
	private findMatchingIdentifiers ({host, statements}: IContainerReferenceFinderFindMethodOptions, aliases: Set<string>): Set<string> {
		const assignments = host.getVariableAssignments(statements);
		return new Set(Object.keys(assignments).filter(variable => assignments[variable] === this.config.exportName || [...aliases].some(alias => assignments[variable] === alias)));
	}

}