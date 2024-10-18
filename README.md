<!-- SHADOW_SECTION_LOGO_START -->

<div><img alt="Logo" src="https://raw.githubusercontent.com/wessberg/di/master/documentation/asset/di-logo.png" height="150"   /></div>

<!-- SHADOW_SECTION_LOGO_END -->

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_START -->

> A compile-time powered Dependency-Injection container for Typescript that holds services and can produce instances of them as required.

<!-- SHADOW_SECTION_DESCRIPTION_SHORT_END -->

<!-- SHADOW_SECTION_BADGES_START -->

<a href="https://npmcharts.com/compare/%40wessberg%2Fdi?minimal=true"><img alt="Downloads per month" src="https://img.shields.io/npm/dm/%40wessberg%2Fdi.svg"    /></a>
<a href="https://www.npmjs.com/package/%40wessberg%2Fdi"><img alt="NPM version" src="https://badge.fury.io/js/%40wessberg%2Fdi.svg"    /></a>
<a href="https://david-dm.org/wessberg/di"><img alt="Dependencies" src="https://img.shields.io/david/wessberg%2Fdi.svg"    /></a>
<a href="https://github.com/wessberg/di/graphs/contributors"><img alt="Contributors" src="https://img.shields.io/github/contributors/wessberg%2Fdi.svg"    /></a>
<a href="https://opensource.org/licenses/MIT"><img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"    /></a>
<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Support on Patreon" src="https://img.shields.io/badge/patreon-donate-green.svg"    /></a>

<!-- SHADOW_SECTION_BADGES_END -->

<!-- SHADOW_SECTION_DESCRIPTION_LONG_START -->

## Description

<!-- SHADOW_SECTION_DESCRIPTION_LONG_END -->

This is a tiny library that brings Dependency-Injection to Typescript. There are several competing libraries out there, but this one is unique in the sense
that:

- It is _seriously_ small.
- It does its work on compile-time. The only runtime dependency is the `DIContainer` itself.
- It doesn't ask you to reflect metadata or to annotate your classes with decorators. _"It just works"_.
- It maps interfaces to implementations. Most popular dependency injection systems for TypeScript doesn't do this. This allows you to truly decouple an abstraction from its implementation.
- It supports the .NET generic reflection flavour: `registerSingleton<Interface, Implementation>()`. No need for anything else.

This library provides constructor-based dependency injection. This means that your classes will receive dependency-injected services as arguments to their constructors.

This library is a runtime dependency, but you need to transform your code with the [`DI Custom Transformer`](https://github.com/wessberg/di-compiler) as part of your Typescript compilation step to make the reflection work.

<!-- SHADOW_SECTION_BACKERS_START -->

## Backers

### Patreon

<a href="https://www.patreon.com/bePatron?u=11315442"><img alt="Patrons on Patreon" src="https://img.shields.io/endpoint.svg?url=https%3A%2F%2Fshieldsio-patreon.vercel.app%2Fapi%3Fusername%3Dwessberg%26type%3Dpatrons"  width="200"  /></a>

<!-- SHADOW_SECTION_BACKERS_END -->

<!-- SHADOW_SECTION_TOC_START -->

## Table of Contents

- [Description](#description)
- [Backers](#backers)
  - [Patreon](#patreon)
- [Table of Contents](#table-of-contents)
- [Install](#install)
  - [npm](#npm)
  - [Yarn](#yarn)
  - [pnpm](#pnpm)
- [Usage](#usage)
  - [Registering services](#registering-services)
  - [Retrieving instances of services](#retrieving-instances-of-services)
    - [Injecting instances of services into classes](#injecting-instances-of-services-into-classes)
    - [Getting instances directly from the `DIContainer`](#getting-instances-directly-from-the-dicontainer)
- [Contributing](#contributing)
- [FAQ](#faq)
  - [This is pure magic. How does it work?](#this-is-pure-magic-how-does-it-work)
  - [Is it possible to have multiple, scoped containers?](#is-it-possible-to-have-multiple-scoped-containers)
- [License](#license)

<!-- SHADOW_SECTION_TOC_END -->

<!-- SHADOW_SECTION_INSTALL_START -->

## Install

### npm

```
$ npm install @wessberg/di
```

### Yarn

```
$ yarn add @wessberg/di
```

### pnpm

```
$ pnpm add @wessberg/di
```

<!-- SHADOW_SECTION_INSTALL_END -->

<!-- SHADOW_SECTION_USAGE_START -->

## Usage

<!-- SHADOW_SECTION_USAGE_END -->

This library is meant to be super straightforward, super simple to use.
The following examples hopefully shows that:

### Registering services

To register services, simply instantiate a new service container and add services to it.
Here's several examples of how you may do that:

```typescript
import {DIContainer} from "@wessberg/di";

// Instantiate a new container for services
const container = new DIContainer();

// Register the service as a Singleton. Whenever the 'IMyService' service is requested,
// the same instance of MyService will be injected
container.registerSingleton<IMyService, MyService>();

// Register the service as a Transient. Whenever the 'IMyService' service is requested,
// a new instance of MyService will be injected
container.registerTransient<IMyOtherService, MyOtherService>();

// Rather than mapping a class to an interface,
// here we provide a function that returns an object that implements
// the required interface
container.registerSingleton<IAppConfig>(() => myAppConfig);

// You don't have to map an interface to an implementation.
container.registerSingleton<MyAwesomeService>();
```

### Retrieving instances of services

#### Injecting instances of services into classes

...Works completely automatically. As long as your class is constructed via
a `DIContainer`, and as long as the services it depends on are registered,
the class will receive the services as arguments to its' constructor:

```typescript
class MyClass {
  constructor(
    private myService: IMyService,
    private myOtherService: IMyOtherService,
    private myAwesomeService: MyAwesomeService
  ) {}
}
```

The true power of this library in comparison to others is that all of this mapping happens on compile-time.
This is what enables you to depend on interfaces, rather than objects that live on runtime.

#### Getting instances directly from the `DIContainer`

Sure, you can do that if you want to:

```typescript
// Gets a concrete instance of 'IMyService'. The implementation will
// depend on what you provided when you registered the service
const service = container.get<IMyService>();
```

<!-- SHADOW_SECTION_CONTRIBUTING_START -->

## Contributing

Do you want to contribute? Awesome! Please follow [these recommendations](./CONTRIBUTING.md).

<!-- SHADOW_SECTION_CONTRIBUTING_END -->

<!-- SHADOW_SECTION_MAINTAINERS_START -->

<!-- SHADOW_SECTION_MAINTAINERS_END -->

<!-- SHADOW_SECTION_FAQ_START -->

## FAQ

<!-- SHADOW_SECTION_FAQ_END -->

#### This is pure magic. How does it work?

It may look like it, but I assure you it is quite simple. [Read this answer for an explanation](https://github.com/wessberg/di-compiler#how-does-it-work-exactly).

#### Is it possible to have multiple, scoped containers?

Sure. You can instantiate as many as you want to, as long as you make sure the [Custom Transformer for DI](https://github.com/wessberg/di-compiler) get's to see the files that contain them.

<!-- SHADOW_SECTION_LICENSE_START -->

## License

MIT ©

<!-- SHADOW_SECTION_LICENSE_END -->
