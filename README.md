# DI (Dependency Injector) [![NPM version][npm-image]][npm-url]
> A Dependency-Injection container that holds services and can produce instances of them as required. It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.

## Installation
Simply do: `npm install @wessberg/di`.

## Usage
```typescript
import {DIContainer} from "@wessberg/di";
DIContainer.registerSingleton<IFoo, Foo>();
DIContainer.registerTransient<IBar, Bar>();
DIContainer.get<IBar>(); // Retrieves a concrete instance of the IBar service.

// And so on...
```

## Changelog:

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