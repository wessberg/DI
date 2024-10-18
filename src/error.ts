import type {Parent} from "./type.js";

export interface InstantiationErrorOptions extends Partial<ErrorOptions> {
	readonly identifier: string;
	readonly parentChain?: (string | Parent<unknown>)[];
}

interface ErrorLike {
	readonly message: string | undefined;
	readonly stack?: string;
}

export class InstantiationError extends TypeError {
	readonly #name = "InstantiationError";
	readonly #originalError: ErrorLike;
	readonly #identifier: string;
	readonly #parentChain: string[];

	get [Symbol.toStringTag]() {
		return this.#name;
	}

	constructor(error: unknown, {identifier, parentChain, ...options}: InstantiationErrorOptions) {
		const message =
			typeof error === "string"
				? error
				: error instanceof Error
					? error.message
					: typeof error === "object" && error != null && "message" in error && typeof error.message === "string"
						? error.message
						: undefined;

		const stack =
			typeof error === "string"
				? undefined
				: error instanceof Error
					? error.stack
					: typeof error === "object" && error != null && "stack" in error && typeof error.stack === "string"
						? error.stack
						: undefined;

		const originalError = error instanceof Error ? error : {message, stack};

		super(message, options);

		this.#identifier = identifier;
		this.#originalError = originalError;
		this.#parentChain = parentChain != null && parentChain.length > 0 ? parentChain.map(item => (typeof item === "string" ? item : item.identifier)) : [this.#identifier];
		this.name = this[Symbol.toStringTag];

		let currentOriginalError = this.#originalError;
		while (currentOriginalError instanceof InstantiationError) {
			currentOriginalError = currentOriginalError.#originalError;
		}

		const lastService = this.#parentChain[this.#parentChain.length - 1]!;
		const head = `Could not instantiate service: '${lastService}'`;
		const body = currentOriginalError.message == null || currentOriginalError.message.length < 1 ? "" : `: ${currentOriginalError.message}`;
		const tail = this.#parentChain.length > 1 ? ` Dependency chain: ${this.#parentChain.join(" -> ")}` : "";

		this.message = `${head}${body}${tail}`;

		if (currentOriginalError.stack != null) {
			this.stack = currentOriginalError.stack;
		}
	}
}
