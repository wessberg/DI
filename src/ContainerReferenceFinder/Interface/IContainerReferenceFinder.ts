import {ISimpleLanguageService} from "@wessberg/simplelanguageservice";
import {NodeArray, Statement} from "typescript";

export interface IContainerReferenceFinderFindMethodOptions {
	host: ISimpleLanguageService;
	statements: NodeArray<Statement>;
	filepath: string;
}

export interface IContainerReferenceFinder {
	find (options: IContainerReferenceFinderFindMethodOptions): Set<string>;
}