# DI (Dependency Injector)

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