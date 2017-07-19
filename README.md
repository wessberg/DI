# DI (Dependency Injector)
[![NPM version][npm-version-image]][npm-version-url]
[![Dev Dependencies][dev-dependencies-image]][dev-dependencies-url]

[dev-dependencies-url]: https://david-dm.org/wessberg/typedetector?type=dev

[dev-dependencies-image]: https://david-dm.org/hub.com/wessberg/di/dev-status.svg
[![deps][deps-image]][deps-url]

[deps-url]: https://david-dm.org/wessberg/typedetector

[deps-image]: https://david-dm.org/hub.com/wessberg/di/status.svg
[![License-mit][license-mit-image]][license-mit-url]

[license-mit-url]: https://opensource.org/licenses/MIT

[license-mit-image]: https://img.shields.io/badge/License-MIT-yellow.svg

[npm-version-url]: https://www.npmjs.com/package/@wessberg/di

[npm-version-image]: https://badge.fury.io/js/%40wessberg%2Fdi.svg
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

## Changelog

<a name="1.0.20"></a>
## 1.0.20 (2017-07-19)

* 1.0.20 ([33a85be](https://github.com/wessberg/di/commit/33a85be))
* Bumped version ([518a4d9](https://github.com/wessberg/di/commit/518a4d9))
* Refined typings to allow non-newable implementations ([db813b6](https://github.com/wessberg/di/commit/db813b6))



<a name="1.0.19"></a>
## 1.0.19 (2017-07-19)

* 1.0.19 ([04b8515](https://github.com/wessberg/di/commit/04b8515))
* Bumped version ([17c361f](https://github.com/wessberg/di/commit/17c361f))
* Fixed an issue in the README ([b4366ec](https://github.com/wessberg/di/commit/b4366ec))



<a name="1.0.18"></a>
## 1.0.18 (2017-07-19)

* 1.0.18 ([5aa7494](https://github.com/wessberg/di/commit/5aa7494))
* Update package.json ([c1a764b](https://github.com/wessberg/di/commit/c1a764b))
* Update README.md ([6377c8b](https://github.com/wessberg/di/commit/6377c8b))
* Updated package.json ([6d08aa7](https://github.com/wessberg/di/commit/6d08aa7))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([b537054](https://github.com/wessberg/di/commit/b537054))
* Added a 'noInject' decorator to the exports of the module which, together with the DI-compiler, will ([29c539e](https://github.com/wessberg/di/commit/29c539e))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-30)

* 1.0.16 ([53d8f6b](https://github.com/wessberg/di/commit/53d8f6b))
* Added a new method: 'has', which returns true if a service matching the given generic type parameter ([f759574](https://github.com/wessberg/di/commit/f759574))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-24)

* 1.0.15 ([9d53d45](https://github.com/wessberg/di/commit/9d53d45))
* Added the 'IGetOptions' and 'IRegisterOptions' to the exports of the module ([df9b8c0](https://github.com/wessberg/di/commit/df9b8c0))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-24)

* 1.0.14 ([e2b442d](https://github.com/wessberg/di/commit/e2b442d))
* Separated the DIContainer from the compiler. ([cff58fc](https://github.com/wessberg/di/commit/cff58fc))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-24)

* 1.0.13 ([70fd18c](https://github.com/wessberg/di/commit/70fd18c))
* Bumped CodeAnalyzer dependency to ^v1.0.8. ([4cb0162](https://github.com/wessberg/di/commit/4cb0162))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-19)

* 1.0.12 ([a78e00e](https://github.com/wessberg/di/commit/a78e00e))
* Bumped CodeAnalyzer dependency to v1.0.7. ([489be4b](https://github.com/wessberg/di/commit/489be4b))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-18)

* 1.0.11 ([7858546](https://github.com/wessberg/di/commit/7858546))
* Fixed a bug where irrelevant CallExpressions would be validated unnecessarily. ([872b616](https://github.com/wessberg/di/commit/872b616))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-18)

* 1.0.10 ([1e97e39](https://github.com/wessberg/di/commit/1e97e39))
* Bumped CodeAnalyzer dependency to v1.0.6. ([22dbdc3](https://github.com/wessberg/di/commit/22dbdc3))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-18)

* 1.0.9 ([50f126d](https://github.com/wessberg/di/commit/50f126d))
* Bumped GlobalObject dependency to v1.0.3 ([938cb3e](https://github.com/wessberg/di/commit/938cb3e))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-18)

* 1.0.8 ([ddd7752](https://github.com/wessberg/di/commit/ddd7752))
* Mapped interfaces are now stored on the global object to support IIFE and arbitrary execution order. ([d3f54a7](https://github.com/wessberg/di/commit/d3f54a7))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-18)

* 1.0.7 ([2e11b2e](https://github.com/wessberg/di/commit/2e11b2e))
* Bumped CodeAnalyzer dependency to v1.0.5. ([1769dad](https://github.com/wessberg/di/commit/1769dad))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-18)

* 1.0.6 ([6ea792a](https://github.com/wessberg/di/commit/6ea792a))
* Bumped CodeAnalyzer dependency to v1.0.4. ([a89267d](https://github.com/wessberg/di/commit/a89267d))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-16)

* 1.0.5 ([0b2fbf1](https://github.com/wessberg/di/commit/0b2fbf1))
* Bumped CodeAnalyzer dependency to v1.0.2. ([1e7f0e5](https://github.com/wessberg/di/commit/1e7f0e5))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-16)

* 1.0.4 ([8c7cde5](https://github.com/wessberg/di/commit/8c7cde5))
* Bumped CodeAnalyzer dependency. ([8e38a9b](https://github.com/wessberg/di/commit/8e38a9b))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-14)

* 1.0.3 ([e93089a](https://github.com/wessberg/di/commit/e93089a))
* Updated README ([52f4c85](https://github.com/wessberg/di/commit/52f4c85))



<a name="1.0.2"></a>
## 1.0.2 (2017-04-24)

* 1.0.2 ([89ff73d](https://github.com/wessberg/di/commit/89ff73d))
* Fixed a bug where 'hasAltered' would always be false. Cleanup. Added typings to .gitignore and .npmi ([ec99adc](https://github.com/wessberg/di/commit/ec99adc))



<a name="1.0.1"></a>
## 1.0.1 (2017-04-24)

* 1.0.1 ([b04742c](https://github.com/wessberg/di/commit/b04742c))
* Changed MagicString type to 'any' since there are no typings available ([b5894af](https://github.com/wessberg/di/commit/b5894af))
* First commit ([c1cf5b9](https://github.com/wessberg/di/commit/c1cf5b9))




## 1.0.19 (2017-07-19)

* 1.0.19 ([04b8515](https://github.com/wessberg/di/commit/04b8515))
* Bumped version ([17c361f](https://github.com/wessberg/di/commit/17c361f))
* Fixed an issue in the README ([b4366ec](https://github.com/wessberg/di/commit/b4366ec))



<a name="1.0.18"></a>
## 1.0.18 (2017-07-19)

* 1.0.18 ([5aa7494](https://github.com/wessberg/di/commit/5aa7494))
* Update package.json ([c1a764b](https://github.com/wessberg/di/commit/c1a764b))
* Update README.md ([6377c8b](https://github.com/wessberg/di/commit/6377c8b))
* Updated package.json ([6d08aa7](https://github.com/wessberg/di/commit/6d08aa7))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([b537054](https://github.com/wessberg/di/commit/b537054))
* Added a 'noInject' decorator to the exports of the module which, together with the DI-compiler, will ([29c539e](https://github.com/wessberg/di/commit/29c539e))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-30)

* 1.0.16 ([53d8f6b](https://github.com/wessberg/di/commit/53d8f6b))
* Added a new method: 'has', which returns true if a service matching the given generic type parameter ([f759574](https://github.com/wessberg/di/commit/f759574))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-24)

* 1.0.15 ([9d53d45](https://github.com/wessberg/di/commit/9d53d45))
* Added the 'IGetOptions' and 'IRegisterOptions' to the exports of the module ([df9b8c0](https://github.com/wessberg/di/commit/df9b8c0))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-24)

* 1.0.14 ([e2b442d](https://github.com/wessberg/di/commit/e2b442d))
* Separated the DIContainer from the compiler. ([cff58fc](https://github.com/wessberg/di/commit/cff58fc))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-24)

* 1.0.13 ([70fd18c](https://github.com/wessberg/di/commit/70fd18c))
* Bumped CodeAnalyzer dependency to ^v1.0.8. ([4cb0162](https://github.com/wessberg/di/commit/4cb0162))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-19)

* 1.0.12 ([a78e00e](https://github.com/wessberg/di/commit/a78e00e))
* Bumped CodeAnalyzer dependency to v1.0.7. ([489be4b](https://github.com/wessberg/di/commit/489be4b))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-18)

* 1.0.11 ([7858546](https://github.com/wessberg/di/commit/7858546))
* Fixed a bug where irrelevant CallExpressions would be validated unnecessarily. ([872b616](https://github.com/wessberg/di/commit/872b616))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-18)

* 1.0.10 ([1e97e39](https://github.com/wessberg/di/commit/1e97e39))
* Bumped CodeAnalyzer dependency to v1.0.6. ([22dbdc3](https://github.com/wessberg/di/commit/22dbdc3))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-18)

* 1.0.9 ([50f126d](https://github.com/wessberg/di/commit/50f126d))
* Bumped GlobalObject dependency to v1.0.3 ([938cb3e](https://github.com/wessberg/di/commit/938cb3e))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-18)

* 1.0.8 ([ddd7752](https://github.com/wessberg/di/commit/ddd7752))
* Mapped interfaces are now stored on the global object to support IIFE and arbitrary execution order. ([d3f54a7](https://github.com/wessberg/di/commit/d3f54a7))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-18)

* 1.0.7 ([2e11b2e](https://github.com/wessberg/di/commit/2e11b2e))
* Bumped CodeAnalyzer dependency to v1.0.5. ([1769dad](https://github.com/wessberg/di/commit/1769dad))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-18)

* 1.0.6 ([6ea792a](https://github.com/wessberg/di/commit/6ea792a))
* Bumped CodeAnalyzer dependency to v1.0.4. ([a89267d](https://github.com/wessberg/di/commit/a89267d))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-16)

* 1.0.5 ([0b2fbf1](https://github.com/wessberg/di/commit/0b2fbf1))
* Bumped CodeAnalyzer dependency to v1.0.2. ([1e7f0e5](https://github.com/wessberg/di/commit/1e7f0e5))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-16)

* 1.0.4 ([8c7cde5](https://github.com/wessberg/di/commit/8c7cde5))
* Bumped CodeAnalyzer dependency. ([8e38a9b](https://github.com/wessberg/di/commit/8e38a9b))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-14)

* 1.0.3 ([e93089a](https://github.com/wessberg/di/commit/e93089a))
* Updated README ([52f4c85](https://github.com/wessberg/di/commit/52f4c85))



<a name="1.0.2"></a>
## 1.0.2 (2017-04-24)

* 1.0.2 ([89ff73d](https://github.com/wessberg/di/commit/89ff73d))
* Fixed a bug where 'hasAltered' would always be false. Cleanup. Added typings to .gitignore and .npmi ([ec99adc](https://github.com/wessberg/di/commit/ec99adc))



<a name="1.0.1"></a>
## 1.0.1 (2017-04-24)

* 1.0.1 ([b04742c](https://github.com/wessberg/di/commit/b04742c))
* Changed MagicString type to 'any' since there are no typings available ([b5894af](https://github.com/wessberg/di/commit/b5894af))
* First commit ([c1cf5b9](https://github.com/wessberg/di/commit/c1cf5b9))




## 1.0.18 (2017-07-19)

* 1.0.18 ([5aa7494](https://github.com/wessberg/di/commit/5aa7494))
* Update package.json ([c1a764b](https://github.com/wessberg/di/commit/c1a764b))
* Update README.md ([6377c8b](https://github.com/wessberg/di/commit/6377c8b))
* Updated package.json ([6d08aa7](https://github.com/wessberg/di/commit/6d08aa7))



<a name="1.0.17"></a>
## 1.0.17 (2017-05-31)

* 1.0.17 ([b537054](https://github.com/wessberg/di/commit/b537054))
* Added a 'noInject' decorator to the exports of the module which, together with the DI-compiler, will ([29c539e](https://github.com/wessberg/di/commit/29c539e))



<a name="1.0.16"></a>
## 1.0.16 (2017-05-30)

* 1.0.16 ([53d8f6b](https://github.com/wessberg/di/commit/53d8f6b))
* Added a new method: 'has', which returns true if a service matching the given generic type parameter ([f759574](https://github.com/wessberg/di/commit/f759574))



<a name="1.0.15"></a>
## 1.0.15 (2017-05-24)

* 1.0.15 ([9d53d45](https://github.com/wessberg/di/commit/9d53d45))
* Added the 'IGetOptions' and 'IRegisterOptions' to the exports of the module ([df9b8c0](https://github.com/wessberg/di/commit/df9b8c0))



<a name="1.0.14"></a>
## 1.0.14 (2017-05-24)

* 1.0.14 ([e2b442d](https://github.com/wessberg/di/commit/e2b442d))
* Separated the DIContainer from the compiler. ([cff58fc](https://github.com/wessberg/di/commit/cff58fc))



<a name="1.0.13"></a>
## 1.0.13 (2017-05-24)

* 1.0.13 ([70fd18c](https://github.com/wessberg/di/commit/70fd18c))
* Bumped CodeAnalyzer dependency to ^v1.0.8. ([4cb0162](https://github.com/wessberg/di/commit/4cb0162))



<a name="1.0.12"></a>
## 1.0.12 (2017-05-19)

* 1.0.12 ([a78e00e](https://github.com/wessberg/di/commit/a78e00e))
* Bumped CodeAnalyzer dependency to v1.0.7. ([489be4b](https://github.com/wessberg/di/commit/489be4b))



<a name="1.0.11"></a>
## 1.0.11 (2017-05-18)

* 1.0.11 ([7858546](https://github.com/wessberg/di/commit/7858546))
* Fixed a bug where irrelevant CallExpressions would be validated unnecessarily. ([872b616](https://github.com/wessberg/di/commit/872b616))



<a name="1.0.10"></a>
## 1.0.10 (2017-05-18)

* 1.0.10 ([1e97e39](https://github.com/wessberg/di/commit/1e97e39))
* Bumped CodeAnalyzer dependency to v1.0.6. ([22dbdc3](https://github.com/wessberg/di/commit/22dbdc3))



<a name="1.0.9"></a>
## 1.0.9 (2017-05-18)

* 1.0.9 ([50f126d](https://github.com/wessberg/di/commit/50f126d))
* Bumped GlobalObject dependency to v1.0.3 ([938cb3e](https://github.com/wessberg/di/commit/938cb3e))



<a name="1.0.8"></a>
## 1.0.8 (2017-05-18)

* 1.0.8 ([ddd7752](https://github.com/wessberg/di/commit/ddd7752))
* Mapped interfaces are now stored on the global object to support IIFE and arbitrary execution order. ([d3f54a7](https://github.com/wessberg/di/commit/d3f54a7))



<a name="1.0.7"></a>
## 1.0.7 (2017-05-18)

* 1.0.7 ([2e11b2e](https://github.com/wessberg/di/commit/2e11b2e))
* Bumped CodeAnalyzer dependency to v1.0.5. ([1769dad](https://github.com/wessberg/di/commit/1769dad))



<a name="1.0.6"></a>
## 1.0.6 (2017-05-18)

* 1.0.6 ([6ea792a](https://github.com/wessberg/di/commit/6ea792a))
* Bumped CodeAnalyzer dependency to v1.0.4. ([a89267d](https://github.com/wessberg/di/commit/a89267d))



<a name="1.0.5"></a>
## 1.0.5 (2017-05-16)

* 1.0.5 ([0b2fbf1](https://github.com/wessberg/di/commit/0b2fbf1))
* Bumped CodeAnalyzer dependency to v1.0.2. ([1e7f0e5](https://github.com/wessberg/di/commit/1e7f0e5))



<a name="1.0.4"></a>
## 1.0.4 (2017-05-16)

* 1.0.4 ([8c7cde5](https://github.com/wessberg/di/commit/8c7cde5))
* Bumped CodeAnalyzer dependency. ([8e38a9b](https://github.com/wessberg/di/commit/8e38a9b))



<a name="1.0.3"></a>
## 1.0.3 (2017-05-14)

* 1.0.3 ([e93089a](https://github.com/wessberg/di/commit/e93089a))
* Updated README ([52f4c85](https://github.com/wessberg/di/commit/52f4c85))



<a name="1.0.2"></a>
## 1.0.2 (2017-04-24)

* 1.0.2 ([89ff73d](https://github.com/wessberg/di/commit/89ff73d))
* Fixed a bug where 'hasAltered' would always be false. Cleanup. Added typings to .gitignore and .npmi ([ec99adc](https://github.com/wessberg/di/commit/ec99adc))



<a name="1.0.1"></a>
## 1.0.1 (2017-04-24)

* 1.0.1 ([b04742c](https://github.com/wessberg/di/commit/b04742c))
* Changed MagicString type to 'any' since there are no typings available ([b5894af](https://github.com/wessberg/di/commit/b5894af))
* First commit ([c1cf5b9](https://github.com/wessberg/di/commit/c1cf5b9))




