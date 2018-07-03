## 1.1.0 (2018-07-03)

* 1.1.0 ([2fb72d6](https://github.com/wessberg/di/commit/2fb72d6))
* Bumped version ([373f14b](https://github.com/wessberg/di/commit/373f14b))
* Fixed an issue with automatically detecting and proxying circular dependencies ([5b26d8d](https://github.com/wessberg/di/commit/5b26d8d))



## <small>1.0.30 (2018-06-21)</small>

* 1.0.30 ([47897a6](https://github.com/wessberg/di/commit/47897a6))
* Bumped version ([f45bbc1](https://github.com/wessberg/di/commit/f45bbc1))
* Fixed a bug ([dac9c90](https://github.com/wessberg/di/commit/dac9c90))



## <small>1.0.29 (2018-06-21)</small>

* 1.0.29 ([466c1ac](https://github.com/wessberg/di/commit/466c1ac))
* Bumped version ([823bf9a](https://github.com/wessberg/di/commit/823bf9a))



## <small>1.0.28 (2018-06-21)</small>

* 1.0.28 ([de443e6](https://github.com/wessberg/di/commit/de443e6))
* Added handling for optionally providing constructor arguments to calls to 'register()' ([74f388e](https://github.com/wessberg/di/commit/74f388e))
* Bumped version ([bf9c4c8](https://github.com/wessberg/di/commit/bf9c4c8))



## <small>1.0.27 (2018-06-08)</small>

* 1.0.27 ([4cb4d7a](https://github.com/wessberg/di/commit/4cb4d7a))
* Added partial support for handling circular dependencies. Added handling for constructor arguments t ([6e73c7a](https://github.com/wessberg/di/commit/6e73c7a))
* Bumped version ([c02089f](https://github.com/wessberg/di/commit/c02089f))



## <small>1.0.26 (2018-02-03)</small>

* 1.0.26 ([8c58e42](https://github.com/wessberg/di/commit/8c58e42))
* Bumped deps. Updated to reflect new Typescript version ([583e59a](https://github.com/wessberg/di/commit/583e59a))
* Bumped version ([36edced](https://github.com/wessberg/di/commit/36edced))



## <small>1.0.25 (2017-09-10)</small>

* 1.0.25 ([ec30aea](https://github.com/wessberg/di/commit/ec30aea))
* Added better diagnostics ([26c0b7d](https://github.com/wessberg/di/commit/26c0b7d))
* Bumped version ([14dfb3e](https://github.com/wessberg/di/commit/14dfb3e))
* Fixed JSDoc ([e927f24](https://github.com/wessberg/di/commit/e927f24))



## <small>1.0.24 (2017-09-03)</small>

* 1.0.24 ([413c87f](https://github.com/wessberg/di/commit/413c87f))
* Updated scripts ([c6a37d5](https://github.com/wessberg/di/commit/c6a37d5))



## <small>1.0.23 (2017-09-03)</small>

* 1.0.23 ([cff1e6b](https://github.com/wessberg/di/commit/cff1e6b))
* Bumped dependencies. Refactoring. Constructor arguments are now kept local to the DIContainer ([6240396](https://github.com/wessberg/di/commit/6240396))
* Bumped version ([fdb5432](https://github.com/wessberg/di/commit/fdb5432))
* Bumped version ([5bad4a5](https://github.com/wessberg/di/commit/5bad4a5))
* Made it possible for implementations of services to be null if a custom new expression is passed as  ([7a15be2](https://github.com/wessberg/di/commit/7a15be2))



## <small>1.0.21 (2017-07-20)</small>

* 1.0.21 ([6211cea](https://github.com/wessberg/di/commit/6211cea))
* Bumped version ([b434dda](https://github.com/wessberg/di/commit/b434dda))
* Fixed a bug where new expressions wouldn't be properly instantiated ([e92b55c](https://github.com/wessberg/di/commit/e92b55c))



## <small>1.0.20 (2017-07-19)</small>

* 1.0.20 ([33a85be](https://github.com/wessberg/di/commit/33a85be))
* Bumped version ([518a4d9](https://github.com/wessberg/di/commit/518a4d9))
* Refined typings to allow non-newable implementations ([db813b6](https://github.com/wessberg/di/commit/db813b6))



## <small>1.0.19 (2017-07-19)</small>

* 1.0.19 ([04b8515](https://github.com/wessberg/di/commit/04b8515))
* Bumped version ([17c361f](https://github.com/wessberg/di/commit/17c361f))
* Fixed an issue in the README ([b4366ec](https://github.com/wessberg/di/commit/b4366ec))



## <small>1.0.18 (2017-07-19)</small>

* 1.0.18 ([5aa7494](https://github.com/wessberg/di/commit/5aa7494))
* Update package.json ([c1a764b](https://github.com/wessberg/di/commit/c1a764b))
* Update README.md ([6377c8b](https://github.com/wessberg/di/commit/6377c8b))
* Updated package.json ([6d08aa7](https://github.com/wessberg/di/commit/6d08aa7))



## <small>1.0.17 (2017-05-31)</small>

* 1.0.17 ([b537054](https://github.com/wessberg/di/commit/b537054))
* Added a 'noInject' decorator to the exports of the module which, together with the DI-compiler, will ([29c539e](https://github.com/wessberg/di/commit/29c539e))



## <small>1.0.16 (2017-05-30)</small>

* 1.0.16 ([53d8f6b](https://github.com/wessberg/di/commit/53d8f6b))
* Added a new method: 'has', which returns true if a service matching the given generic type parameter ([f759574](https://github.com/wessberg/di/commit/f759574))



## <small>1.0.15 (2017-05-24)</small>

* 1.0.15 ([9d53d45](https://github.com/wessberg/di/commit/9d53d45))
* Added the 'IGetOptions' and 'IRegisterOptions' to the exports of the module ([df9b8c0](https://github.com/wessberg/di/commit/df9b8c0))



## <small>1.0.14 (2017-05-24)</small>

* 1.0.14 ([e2b442d](https://github.com/wessberg/di/commit/e2b442d))
* Separated the DIContainer from the compiler. ([cff58fc](https://github.com/wessberg/di/commit/cff58fc))



## <small>1.0.13 (2017-05-24)</small>

* 1.0.13 ([70fd18c](https://github.com/wessberg/di/commit/70fd18c))
* Bumped CodeAnalyzer dependency to ^v1.0.8. ([4cb0162](https://github.com/wessberg/di/commit/4cb0162))



## <small>1.0.12 (2017-05-19)</small>

* 1.0.12 ([a78e00e](https://github.com/wessberg/di/commit/a78e00e))
* Bumped CodeAnalyzer dependency to v1.0.7. ([489be4b](https://github.com/wessberg/di/commit/489be4b))



## <small>1.0.11 (2017-05-18)</small>

* 1.0.11 ([7858546](https://github.com/wessberg/di/commit/7858546))
* Fixed a bug where irrelevant CallExpressions would be validated unnecessarily. ([872b616](https://github.com/wessberg/di/commit/872b616))



## <small>1.0.10 (2017-05-18)</small>

* 1.0.10 ([1e97e39](https://github.com/wessberg/di/commit/1e97e39))
* Bumped CodeAnalyzer dependency to v1.0.6. ([22dbdc3](https://github.com/wessberg/di/commit/22dbdc3))



## <small>1.0.9 (2017-05-18)</small>

* 1.0.9 ([50f126d](https://github.com/wessberg/di/commit/50f126d))
* Bumped GlobalObject dependency to v1.0.3 ([938cb3e](https://github.com/wessberg/di/commit/938cb3e))



## <small>1.0.8 (2017-05-18)</small>

* 1.0.8 ([ddd7752](https://github.com/wessberg/di/commit/ddd7752))
* Mapped interfaces are now stored on the global object to support IIFE and arbitrary execution order. ([d3f54a7](https://github.com/wessberg/di/commit/d3f54a7))



## <small>1.0.7 (2017-05-18)</small>

* 1.0.7 ([2e11b2e](https://github.com/wessberg/di/commit/2e11b2e))
* Bumped CodeAnalyzer dependency to v1.0.5. ([1769dad](https://github.com/wessberg/di/commit/1769dad))



## <small>1.0.6 (2017-05-18)</small>

* 1.0.6 ([6ea792a](https://github.com/wessberg/di/commit/6ea792a))
* Bumped CodeAnalyzer dependency to v1.0.4. ([a89267d](https://github.com/wessberg/di/commit/a89267d))



## <small>1.0.5 (2017-05-16)</small>

* 1.0.5 ([0b2fbf1](https://github.com/wessberg/di/commit/0b2fbf1))
* Bumped CodeAnalyzer dependency to v1.0.2. ([1e7f0e5](https://github.com/wessberg/di/commit/1e7f0e5))



## <small>1.0.4 (2017-05-16)</small>

* 1.0.4 ([8c7cde5](https://github.com/wessberg/di/commit/8c7cde5))
* Bumped CodeAnalyzer dependency. ([8e38a9b](https://github.com/wessberg/di/commit/8e38a9b))



## <small>1.0.3 (2017-05-14)</small>

* 1.0.3 ([e93089a](https://github.com/wessberg/di/commit/e93089a))
* Updated README ([52f4c85](https://github.com/wessberg/di/commit/52f4c85))



## <small>1.0.2 (2017-04-24)</small>

* 1.0.2 ([89ff73d](https://github.com/wessberg/di/commit/89ff73d))
* Fixed a bug where 'hasAltered' would always be false. Cleanup. Added typings to .gitignore and .npmi ([ec99adc](https://github.com/wessberg/di/commit/ec99adc))



## <small>1.0.1 (2017-04-24)</small>

* 1.0.1 ([b04742c](https://github.com/wessberg/di/commit/b04742c))
* Changed MagicString type to 'any' since there are no typings available ([b5894af](https://github.com/wessberg/di/commit/b5894af))
* First commit ([c1cf5b9](https://github.com/wessberg/di/commit/c1cf5b9))



