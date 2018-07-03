import {IContainerIdentifierable} from "../container-identifierable/i-container-identifierable";
import {IParent} from "./i-parent";

export interface IConstructInstanceOptions<T> extends IContainerIdentifierable {
	parentChain?: IParent<{}>[];
}