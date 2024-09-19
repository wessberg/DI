'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER = `___CTOR_ARGS___`;
const CONSTRUCTOR_ARGUMENTS_SYMBOL = Symbol.for(CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER);

/**
 * A Dependency-Injection container that holds services and can produce instances of them as required.
 * It mimics reflection by parsing the app at compile-time and supporting the generic-reflection syntax.
 * @author Frederik Wessberg
 */
class DIContainer {
    registerSingleton(newExpression, options) {
        if (options == null) {
            throw new ReferenceError(`2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
        }
        if (newExpression == null) {
            return this.register("SINGLETON", newExpression, options);
        }
        else {
            return this.register("SINGLETON", newExpression, options);
        }
    }
    registerTransient(newExpression, options) {
        if (options == null) {
            throw new ReferenceError(`2 arguments required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
        }
        if (newExpression == null) {
            return this.register("TRANSIENT", newExpression, options);
        }
        else {
            return this.register("TRANSIENT", newExpression, options);
        }
    }
    /**
     * Gets an instance of the service matching the interface given as a generic type parameter.
     * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
     * generic interface name.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    get(options) {
        if (options == null) {
            throw new ReferenceError(`1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
        }
        return this.constructInstance(options);
    }
    /**
     * Returns true if a service has been registered matching the interface given as a generic type parameter.
     * For example, 'container.get<IFoo>()' returns a concrete instance of the implementation associated with the
     * generic interface name.
     *
     * You should not pass any options to the method if using the compiler. It will do that automatically.
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    has(options) {
        if (options == null) {
            throw new ReferenceError(`1 argument required, but only 0 present. ${DI_COMPILER_ERROR_HINT}`);
        }
        return this.diContainerMaps.serviceRegistry.has(options.identifier);
    }
    register(kind, newExpression, options) {
        // Take all of the constructor arguments for the implementation
        const implementationArguments = "implementation" in options &&
            options.implementation != null &&
            options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL] != null
            ? options.implementation[CONSTRUCTOR_ARGUMENTS_SYMBOL]
            : [];
        this.diContainerMaps.constructorArguments.set(options.identifier, implementationArguments);
        this.diContainerMaps.serviceRegistry.set(options.identifier, "implementation" in options && options.implementation != null
            ? { ...options, kind }
            : { ...options, kind, newExpression: newExpression });
    }
    /**
     * Returns true if an instance exists that matches the given identifier.
     */
    hasInstance(identifier) {
        return this.getInstance(identifier) != null;
    }
    /**
     * Gets the cached instance, if any, associated with the given identifier.
     */
    getInstance(identifier) {
        const instance = this.diContainerMaps.instances.get(identifier);
        return instance == null ? null : instance;
    }
    /**
     * Gets an IRegistrationRecord associated with the given identifier.
     */
    getRegistrationRecord({ identifier, parentChain, }) {
        const record = this.diContainerMaps.serviceRegistry.get(identifier);
        if (record == null) {
            throw new ReferenceError(`${this.constructor.name} could not find a service for identifier: "${identifier}". ${parentChain == null || parentChain.length < 1
                ? ""
                : `It is required by the service: '${parentChain
                    .map((parent) => parent.identifier)
                    .join(" -> ")}'.`} Remember to register it as a service!`);
        }
        return record;
    }
    /**
     * Caches the given instance so that it can be retrieved in the future.
     */
    setInstance(identifier, instance) {
        this.diContainerMaps.instances.set(identifier, instance);
        return instance;
    }
    /**
     * Gets a lazy reference to another service
     */
    getLazyIdentifier(lazyPointer) {
        return (new Proxy({}, { get: (_, key) => lazyPointer()[key] }));
    }
    /**
     * Constructs a new instance of the given identifier and returns it.
     * It checks the constructor arguments and injects any services it might depend on recursively.
     */
    constructInstance({ identifier, parentChain = [], }) {
        const registrationRecord = this.getRegistrationRecord({
            identifier,
            parentChain,
        });
        // If an instance already exists (and it is a singleton), return that one
        if (this.hasInstance(identifier) &&
            registrationRecord.kind === "SINGLETON") {
            return this.getInstance(identifier);
        }
        // Otherwise, instantiate a new one
        let instance;
        const me = {
            identifier,
            ref: this.getLazyIdentifier(() => instance),
        };
        // If a user-provided new-expression has been provided, invoke that to get an instance.
        if ("newExpression" in registrationRecord) {
            if (typeof registrationRecord.newExpression !== "function") {
                throw new TypeError(`Could not instantiate the service with the identifier: '${registrationRecord.identifier}': You provided a custom instantiation argument, but it wasn't of type function. It has to be a function that returns whatever should be used as an instance of the Service!`);
            }
            try {
                instance = registrationRecord.newExpression();
            }
            catch (ex) {
                throw new Error(`Could not instantiate the service with the identifier: '${registrationRecord.identifier}': When you registered the service, you provided a custom instantiation function, but it threw an exception when it was run!`);
            }
        }
        else {
            // Find the arguments for the identifier
            const mappedArgs = this.diContainerMaps.constructorArguments.get(identifier);
            if (mappedArgs == null) {
                throw new ReferenceError(`${this.constructor.name} could not find constructor arguments for the service: '${identifier}'. Have you registered it as a service?`);
            }
            // Instantiate all of the argument services (or re-use them if they were registered as singletons)
            const instanceArgs = mappedArgs.map((dep) => {
                if (dep === undefined)
                    return undefined;
                const matchedParent = parentChain.find((parent) => parent.identifier === dep);
                if (matchedParent != null)
                    return matchedParent.ref;
                return this.constructInstance({
                    identifier: dep,
                    parentChain: [...parentChain, me],
                });
            });
            try {
                // Try to construct an instance with 'new' and if it fails, call the implementation directly.
                const newable = registrationRecord.implementation;
                instance = new newable(...instanceArgs);
            }
            catch (ex) {
                if (registrationRecord.implementation == null) {
                    throw new ReferenceError(`${this.constructor.name} could not construct a new service of kind: ${identifier}. Reason: No implementation was given!`);
                }
                const constructable = registrationRecord.implementation;
                // Try without 'new' and call the implementation as a function.
                instance = constructable(...instanceArgs);
            }
        }
        return registrationRecord.kind === "SINGLETON"
            ? this.setInstance(identifier, instance)
            : instance;
    }
    /**
    * Maps that may get defined during Moddable pre-load, and then frozen into flash memory.  See the getter
    * `diContainerMaps` which handles the transition from flash to runtime for the maps.
    */
    writableDiContainerMaps = {
        constructorArguments: new Map(),
        serviceRegistry: new Map(),
        instances: new Map()
    };
    /**
    * Getter that provides access to the various maps.  Handles cloning the maps from the read-only preload condition
    * to a writable runtime version to support Moddable preloads.
    */
    get diContainerMaps() {
        // if a map is frozen, it has been preloaded, so we need to clone the map.  This happens because registrations
        // occur during preload, but then also need to work at runtime.
        if (Object.isFrozen(this.writableDiContainerMaps.constructorArguments)) {
            this.writableDiContainerMaps.constructorArguments = new Map(this.writableDiContainerMaps.constructorArguments);
            this.writableDiContainerMaps.instances = new Map(this.writableDiContainerMaps.instances);
            this.writableDiContainerMaps.serviceRegistry = new Map(this.writableDiContainerMaps.serviceRegistry);
        }
        return this.writableDiContainerMaps;
    }
}
const DI_COMPILER_ERROR_HINT = `Note: You must use DI-Compiler (https://github.com/wessberg/di-compiler) for this library to work correctly. Please consult the readme for instructions on how to install and configure it for your project.`;

exports.CONSTRUCTOR_ARGUMENTS_SYMBOL = CONSTRUCTOR_ARGUMENTS_SYMBOL;
exports.CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER = CONSTRUCTOR_ARGUMENTS_SYMBOL_IDENTIFIER;
exports.DIContainer = DIContainer;
//# sourceMappingURL=index.js.map
