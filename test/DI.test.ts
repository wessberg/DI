import {test} from "ava";
import {compile} from "../src/DI";
import {DIConfig} from "../src/DIConfig/DIConfig";

test("blabla", t => {
	compile("a_file.ts", `
		interface IFoo {}
		interface IBar {}
		
		class Foo implements IFoo {
			a: string = "foo";
		}

		class Bar implements IBar {
			works: boolean = false;
			constructor (private foo: IFoo, private test = 2, private foo2: IFoo) {
				this.works = foo.a != null;
			}
		}

		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IFoo, Foo>();
		${DIConfig.exportName}.${DIConfig.registerSingletonName}<IBar, Bar>();
		${DIConfig.exportName}.${DIConfig.getName}<IBar>();
	`);

	// An exception didn't occur. Success!
	t.true(true);
});