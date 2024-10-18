/* eslint-disable @typescript-eslint/no-extraneous-class, max-classes-per-file */
import test from "node:test";
import assert from "node:assert";
import {DIContainer} from "../src/di-container.js";
import {CONSTRUCTOR_ARGUMENTS_SYMBOL} from "../src/constant.js";
import {InstantiationError} from "../src/error.js";

test(`DIContainer only exposes a constructor and the methods 'registerSingleton', 'registerTransient', 'get', and 'has'.`, () => {
	const propertyNames = Object.getOwnPropertyNames(DIContainer.prototype);
	assert.deepEqual(propertyNames, ["constructor", "registerSingleton", "registerTransient", "get", "has"]);
});

test(`Will throw when attempting to get a service for which one of its dependencies are not registered. #1`, () => {
	class ServiceA {}

	class ServiceB {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ServiceA"];
		}

		constructor(public serviceA: ServiceA) {}
	}

	const container = new DIContainer();
	container.registerSingleton<ServiceB>(undefined, {identifier: "ServiceB", implementation: ServiceB});

	assert.throws(() => container.get<ServiceB>({identifier: "ServiceB"}), InstantiationError);
});

test(`Will throw when attempting to get a service for which one of its dependencies are not registered. #2`, () => {
	class ServiceA {}

	class ServiceB {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ServiceA"];
		}

		constructor(public serviceA: ServiceA) {}
	}

	class ServiceC {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ServiceB"];
		}

		constructor(public serviceB: ServiceB) {}
	}

	const container = new DIContainer();
	container.registerSingleton<ServiceB>(undefined, {identifier: "ServiceB", implementation: ServiceB});
	container.registerSingleton<ServiceC>(undefined, {identifier: "ServiceC", implementation: ServiceC});

	assert.throws(() => container.get<ServiceC>({identifier: "ServiceC"}), InstantiationError);
});

test(`Will not swallow exceptions thrown in constructors not relating to dependency injection. #1`, () => {
	class ServiceA {}

	class ServiceB {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["ServiceA"];
		}

		constructor(public serviceA: ServiceA) {
			throw new RangeError("This is unrelated error.");
		}
	}

	const container = new DIContainer();
	container.registerSingleton<ServiceA>(undefined, {identifier: "ServiceA", implementation: ServiceA});
	container.registerSingleton<ServiceB>(undefined, {identifier: "ServiceB", implementation: ServiceB});

	assert.throws(() => container.get<ServiceB>({identifier: "ServiceB"}), RangeError);
});

test(`Will not swallow exceptions thrown in constructor functions not relating to dependency injection. #1`, () => {
	interface ServiceA {
		foo: string;
	}

	const container = new DIContainer();

	container.registerSingleton<ServiceA>(
		() => {
			throw new RangeError("This is unrelated error.");
		},
		{identifier: "ServiceA"}
	);

	assert.throws(() => container.get<ServiceA>({identifier: "ServiceA"}), RangeError);
});

test(`Can construct services with constructor functions. #1`, () => {
	interface ServiceA {
		foo: string;
	}

	const container = new DIContainer();

	container.registerSingleton<ServiceA>(
		() => ({
			foo: "bar"
		}),
		{identifier: "ServiceA"}
	);

	assert.deepEqual(container.get<ServiceA>({identifier: "ServiceA"}), {foo: "bar"});
});

test(`Can construct services with class constructors. #1`, () => {
	interface IServiceA {
		foo: string;
	}

	class ServiceA implements IServiceA {
		readonly foo = "bar";
	}

	const container = new DIContainer();
	container.registerSingleton<IServiceA, ServiceA>(undefined, {identifier: "IServiceA", implementation: ServiceA});

	assert.deepEqual(container.get<IServiceA>({identifier: "IServiceA"}).foo, "bar");
});

test(`Can construct services with class constructors. #2`, () => {
	interface IServiceA {
		foo: string;
	}

	interface IServiceB {
		bar: string;
		serviceA: IServiceA;
	}

	interface IServiceC {
		baz: string;
		serviceB: IServiceB;
	}

	class ServiceA implements IServiceA {
		readonly foo = "foo";
	}

	class ServiceB implements IServiceB {
		readonly bar = "bar";

		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["IServiceA"];
		}

		constructor(public serviceA: IServiceA) {}
	}

	class ServiceC implements IServiceC {
		readonly baz = "baz";

		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["IServiceB"];
		}

		constructor(public serviceB: IServiceB) {}
	}

	const container = new DIContainer();

	container.registerSingleton<IServiceA, ServiceA>(undefined, {identifier: "IServiceA", implementation: ServiceA});
	container.registerSingleton<IServiceB, ServiceB>(undefined, {identifier: "IServiceB", implementation: ServiceB});
	container.registerSingleton<IServiceC, ServiceC>(undefined, {identifier: "IServiceC", implementation: ServiceC});

	const aInstance = container.get<IServiceA>({identifier: "IServiceA"});
	const bInstance = container.get<IServiceB>({identifier: "IServiceB"});
	const cInstance = container.get<IServiceC>({identifier: "IServiceC"});

	assert.deepEqual(cInstance.serviceB, bInstance);
	assert.deepEqual(bInstance.serviceA, aInstance);
});

test(`Services that allow for nullable values can be constructed without exceptions. #1`, () => {
	interface IServiceA {
		foo: string;
	}

	type NullableServiceA = IServiceA | undefined;

	const container = new DIContainer();

	container.registerSingleton<NullableServiceA>(() => undefined, {identifier: "NullableServiceA"});
	assert.doesNotThrow(() => container.get<NullableServiceA>({identifier: "NullableServiceA"}));
});

test(`Services that allow for nullable values can be constructed without exceptions. #2`, () => {
	interface IServiceA {
		foo: string;
	}

	type NullableServiceA = IServiceA | undefined;

	class ServiceB {
		static get [CONSTRUCTOR_ARGUMENTS_SYMBOL]() {
			return ["NullableServiceA"];
		}

		constructor(public serviceA: NullableServiceA) {}
	}

	const container = new DIContainer();

	container.registerSingleton<NullableServiceA>(() => undefined, {identifier: "NullableServiceA"});
	container.registerSingleton<ServiceB>(undefined, {identifier: "ServiceB", implementation: ServiceB});

	assert.doesNotThrow(() => container.get<ServiceB>({identifier: "ServiceB"}));
});
