export interface IHasAlteredable {
	hasAltered: boolean;
}

export interface ICodeable {
	code: MagicString;
}

export interface ICompilerResult extends ICodeable, IHasAlteredable {
}

export interface ICompiler {
	compile (filepath: string, codeContainer: ICompilerResult): ICompilerResult;
	getClassConstructorArgumentsMapStringified (): string;
}