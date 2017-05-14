import {test} from "ava";
import {compile} from "../src/DI";
import {DIConfig} from "../src/DIConfig/DIConfig";

test("blabla", t => {
	compile("a_file.ts", `
		class Bar implements IBar {
			constructor (private foo: IFoo) {}
		}

		class Foo implements IFoo {
		}
		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IFoo, Foo>();
		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IBar, Bar>();
		${DIConfig.exportName}.${DIConfig.getName}<IBar>();
	`);

	t.true(true);
});