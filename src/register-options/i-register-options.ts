import { IContainerIdentifierable } from "../container-identifierable/i-container-identifierable";
import { Implementation } from "../implementation/implementation";

export interface IRegisterOptionsBase extends IContainerIdentifierable {}

export interface IRegisterOptionsWithImplementation<T>
  extends IRegisterOptionsBase {
  implementation: Implementation<T> | null;
}

export interface IRegisterOptionsWithoutImplementation
  extends IRegisterOptionsBase {}

export type RegisterOptions<T> =
  | IRegisterOptionsWithImplementation<T>
  | IRegisterOptionsWithoutImplementation;
