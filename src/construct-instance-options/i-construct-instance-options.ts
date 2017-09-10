import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";

export interface IConstructInstanceOptions extends IContainerIdentifierable {
	parent?: string;
}