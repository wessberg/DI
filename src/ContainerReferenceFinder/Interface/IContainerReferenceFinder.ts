import {ICodeAnalyzer} from "@wessberg/codeanalyzer";
import {NodeArray, Statement} from "typescript";

export interface IContainerReferenceFinderFindMethodOptions {
	host: ICodeAnalyzer;
	statements: NodeArray<Statement>;
}

export interface IContainerReferenceFinder {
	find (options: IContainerReferenceFinderFindMethodOptions): Set<string>;
}