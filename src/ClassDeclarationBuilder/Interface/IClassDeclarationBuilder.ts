import {IClassDeclaration, ISimpleLanguageService} from "@wessberg/simplelanguageservice";
import {NodeArray, Statement} from "typescript";

export interface IClassDeclarationBuilderMethodOptions {
	host: ISimpleLanguageService;
	statements: NodeArray<Statement>;
	filepath: string;
	code: string;
}

export interface IClassDeclarationBuilder {
	build(options: IClassDeclarationBuilderMethodOptions): IClassDeclaration[];
}