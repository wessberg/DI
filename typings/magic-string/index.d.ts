interface SourceMapOptions {
	file?: string; // the filename where you plan to write the sourcemap
	hires?: boolean; // whether the mapping should be high-resolution. Hi-res mappings map every single character, meaning (for example) your devtools will always be able to pinpoint the exact location of function calls and so on. With lo-res mappings, devtools may only be able to identify the correct line - but they're quicker to generate and less bulky. If sourcemap locations have been specified with s.addSourceMapLocation(), they will be used here.
	source?: string; // the filename of the file containing the original source
	includeContent?: boolean; // whether to include the original content in the map's sourcesContent array
}

declare class MagicString {
	constructor (code: string);
	overwrite (start: number, end: number, replacement: string): void;
	append (content: string): void;
	prepend (content: string): void;
	appendLeft (index: number, content: string): void;
	toString (): string;
	generateMap(options: SourceMapOptions): string;
}

declare module "magic-string" {
	export default MagicString;
}