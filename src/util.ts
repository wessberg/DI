import type {CustomConstructableService, NewableService} from "./type.js";

export function isClass<T>(item: unknown): item is NewableService<T> {
	// First, ensure the input is a function
	if (typeof item !== "function") {
		return false;
	}

	// Get the property descriptor for 'prototype'
	const descriptor = Object.getOwnPropertyDescriptor(item, "prototype");

	// Classes do not have a writable 'prototype' property
	// If 'prototype' is non-writable, it's likely a class constructor
	return !!descriptor && !descriptor.writable;
}

export function isCustomConstructableService<T>(item: unknown): item is CustomConstructableService<T> {
	return !isClass(item) && typeof item === "function";
}
