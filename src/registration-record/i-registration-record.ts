import {IRegisterOptionsWithImplementation, IRegisterOptionsWithoutImplementation} from "../register-options/i-register-options";
import {RegistrationKind} from "../registration-kind/registration-kind";
import {ImplementationInstance} from "../implementation/implementation";

export interface IRegistrationRecordBase<T> {
	kind: RegistrationKind;
}

export interface IRegistrationRecordWithoutImplementation<T> extends IRegistrationRecordBase<T>, IRegisterOptionsWithoutImplementation<T> {
	kind: RegistrationKind;
	newExpression: ImplementationInstance<T>;
}

export interface IRegistrationRecordWithImplementation<T> extends IRegistrationRecordBase<T>, IRegisterOptionsWithImplementation<T> {
	kind: RegistrationKind;
}

export type RegistrationRecord<T> = IRegistrationRecordWithImplementation<T>|IRegistrationRecordWithoutImplementation<T>;