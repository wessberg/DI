// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type NewableService<T> = new (...args: any[]) => T;
