import {IRegisterOptions} from "../register-options/i-register-options";
import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";
import {RegistrationKind} from "../registration-kind/registration-kind";

export interface IRegistrationRecord<T, U extends T> extends IRegisterOptions<T>, IContainerIdentifierable {
	kind: RegistrationKind;
	newExpression? (): U;
}