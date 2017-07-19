# DI (Dependency Injector) [![NPM version][npm-image]][npm-url]
> A Dependency-Injection container that holds services and can produce instances of them as required. It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.

## Installation
Simply do: `npm install @wessberg/di`.

## Description

`DI` is truly a fresh take on dependency injection in a TypeScript/JavaScript environment:

- It does its work on compile-time. The only runtime dependency is the DIContainer itself, which is tiny.
- It doesn't ask you to reflect metadata or to annotate your classes with decorators. "It just works".
- It maps interfaces to implementations. Most popular dependency injection systems for TypeScript doesn't do this. This allows you to truly decouple an abstraction from its implementation.
- It supports the .NET generic reflection flavour: `registerSingleton<Interface, Implementation>()`. No need for anything else.

## Usage
```typescript
import {DIContainer} from "@wessberg/di";
DIContainer.registerSingleton<IFoo, Foo>();
DIContainer.registerTransient<IBar, Bar>();
DIContainer.get<IBar>(); // Retrieves a concrete instance of the IBar service.

// And so on...
```

### Overwriting a new-expression for a custom constructor

Sometimes, you may want to invoke the constructor of a service with custom arguments, rather than relying on every other non-initialized parameter of the service constructor to be dependency injected.
You can do that by passing a function that returns a new instance of the provided service as the first argument `registerSingleton` or `registerTransient`.  

```typescript
DIContainer.registerSingleton<IFoo, Foo>(() => new Foo("customArg", 123, "foo"));
```

### Making it work

To make the injections work - and to support the generic reflection notation - you need to compile the source code with the [DI-Compiler](https://github.com/wessberg/DI-compiler).

If you are using [Rollup](https://github.com/rollup/rollup), then use [rollup-plugin-di](https://github.com/wessberg/rollup-plugin-di) to compile your code automatically as part of your bundle.

## How does it work

It uses [CodeAnalyzer](https://github.com/wessberg/CodeAnalyzer) to check all of your code and all of its dependencies recursively to track classes and the constructor arguments they take (and their order). When a `DIContainer` constructs a new instance of a service, it knows which concrete implementations match interfaces that exists in the signature of class constructors.

## Changelog:

**v1.0.17**:

- Added a `noInject` decorator to the exports of the module which, together with the DI-compiler, will tell the Compiler to skip the classes that has it.

**v1.0.16**:

- Added a new method: `has`, which returns true if a service matching the given generic type parameter has been registered.

**v1.0.15**:

- Added the `IGetOptions` and `IRegisterOptions` to the exports of the module.

**v1.0.14**:

- Separated the DIContainer from the compiler. The compiler has moved [here](https://www.npmjs.com/package/@wessberg/di-compiler).

**v1.0.13**:

- Bumped CodeAnalyzer dependency to ^v1.0.8.

**v1.0.12**

- Bumped CodeAnalyzer dependency to v1.0.7.

**v1.0.11**:

- Fixed a bug where irrelevant CallExpressions would be validated unnecessarily.

**v1.0.10**:

- Bumped CodeAnalyzer dependency to v1.0.6.

**v1.0.9**:

- Bumped GlobalObject dependency to v1.0.3

**v1.0.8**:

- Mapped interfaces are now stored on the global object to support IIFE and arbitrary execution order.

**v1.0.7**:

- Bumped CodeAnalyzer dependency to v1.0.5.

**v1.0.6**:

- Bumped CodeAnalyzer dependency to v1.0.4.

**v1.0.5**:

- Bumped CodeAnalyzer dependency to v1.0.2.

**v1.0.3**:

- Upgraded to newest version of 'CodeAnalyzer' and refactored all around.

**v1.0.1**:

- Fixed a bug where 'hasAltered' would always be false. Cleanup. Added typings to .gitignore and .npmignore.

**v1.0.0**:

- First release.

[npm-url]: https://npmjs.org/package/@wessberg/di
[npm-image]: https://badge.fury.io/js/@wessberg/di.svg
