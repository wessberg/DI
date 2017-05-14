import {IDIConfig} from "../DIConfig/Interface/IDIConfig";
import {IContainerReferenceFinder, IContainerReferenceFinderFindMethodOptions} from "./Interface/IContainerReferenceFinder";

/**
 * Tracks any reference to the DIContainer in specific files, taking into account any potential local or
 * imported/exported aliases for the DIContainer instance.
 * @author Frederik Wessberg
 */
export class ContainerReferenceFinder implements IContainerReferenceFinder {
	private static exportedAliases: Set<string>;
	constructor (private config: IDIConfig) {
		if (ContainerReferenceFinder.exportedAliases == null) {
			ContainerReferenceFinder.exportedAliases = new Set([config.exportName]);
		}
	}

	/**
	 * Parses the file for existing or new references to the DIContainer and returns them as a Set.
	 * @param host
	 * @param statements
	 * @param {string} filepath
	 * @returns {Set<string>}
	 */
	public find ({host, statements}: IContainerReferenceFinderFindMethodOptions): Set<string> {

		// Find variables that are assigned to the DIContainer
		const assignedTo = this.findMatchingIdentifiers({host, statements}, ContainerReferenceFinder.exportedAliases);

		// Track these variables, in case they are exported for consumption of other modules
		const exportedAliases = [...assignedTo].filter(alias => this.isAliasExported({host, statements}, alias));
		exportedAliases.forEach(alias => ContainerReferenceFinder.exportedAliases.add(alias));

		// Assert that the DIContainer or one of its aliases are actually being imported.
		const matchingImports = this.findImports({host, statements}, ContainerReferenceFinder.exportedAliases);

		// Construct a Set of all identifiers for the container in the local scope of this file.
		return new Set([...assignedTo, ...matchingImports, this.config.exportName]);
	}

	/**
	 * Decides if an identifier matches the name of the DIContainer or any of the given aliases.
	 * @param {string} identifier
	 * @param {Set<string>} aliases
	 * @returns {boolean}
	 */
	private isRelevantIdentifier (identifier: string, aliases: Set<string>): boolean {
		return aliases.has(identifier);
	}

	/**
	 * Checks the imports of the current file for the identifier for the DIContainer or one of its aliases.
	 * @param host
	 * @param statements
	 * @param {string} filepath
	 * @param {Set<string>} aliases
	 * @returns {Set<string>}
	 */
	private findImports ({host, statements}: IContainerReferenceFinderFindMethodOptions, aliases: Set<string>): Set<string> {
		const importDeclarations = host.getImportDeclarations(statements, true)
		// Take only the import declarations that contains relevant bindings
			.filter(declaration => Object.keys(declaration.bindings)
				.find(binding => this.isRelevantIdentifier(binding, aliases)) != null);

		const set: Set<string> = new Set();

		// Take the individual bound identifiers and add them to the set.
		importDeclarations.forEach(importDeclaration => {
			Object.keys(importDeclaration.bindings).forEach(binding => {
				if (this.isRelevantIdentifier(binding, aliases)) set.add(binding);
			});
		});
		return set;
	}

	/**
	 * Checks if an alias for the DIContainer is being exported by the current file.
	 * @param host
	 * @param statements
	 * @param {string} alias
	 * @returns {boolean}
	 */
	private isAliasExported ({host, statements}: IContainerReferenceFinderFindMethodOptions, alias: string): boolean {
		const exportDeclarations = host.getExportDeclarations(statements, true);
		return exportDeclarations.some(declaration => declaration.bindings[alias] != null);
	}

	/**
	 * Finds any variable assignments that binds to the DIContainer or any of its aliases.
	 * These become new aliases. We simply try our best at tracking all references to the concrete instance.
	 * @param host
	 * @param statements
	 * @param {Set<string>} aliases
	 * @returns {Set<string>}
	 */
	private findMatchingIdentifiers ({host, statements}: IContainerReferenceFinderFindMethodOptions, aliases: Set<string>): Set<string> {
		const assignments = host.getVariableAssignments(statements, true);
		return new Set(Object.keys(assignments).filter(name => this.isRelevantIdentifier(name, aliases)));
	}

}