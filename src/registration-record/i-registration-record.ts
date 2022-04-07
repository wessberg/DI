import {
  IRegisterOptionsWithImplementation,
  IRegisterOptionsWithoutImplementation,
} from "../register-options/i-register-options";
import { RegistrationKind } from "../registration-kind/registration-kind";
import { ImplementationInstance } from "../implementation/implementation";

export interface IRegistrationRecordBase {
  kind: RegistrationKind;
}

export interface IRegistrationRecordWithoutImplementation<T>
  extends IRegistrationRecordBase,
    IRegisterOptionsWithoutImplementation {
  kind: RegistrationKind;
  newExpression: ImplementationInstance<T>;
}

export interface IRegistrationRecordWithImplementation<T>
  extends IRegistrationRecordBase,
    IRegisterOptionsWithImplementation<T> {
  kind: RegistrationKind;
}

export type RegistrationRecord<T> =
  | IRegistrationRecordWithImplementation<T>
  | IRegistrationRecordWithoutImplementation<T>;
