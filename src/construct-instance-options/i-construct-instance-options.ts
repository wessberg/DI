import { IContainerIdentifierable } from "../container-identifierable/i-container-identifierable";
import { IParent } from "./i-parent";

export interface IConstructInstanceOptions extends IContainerIdentifierable {
  parentChain?: IParent<unknown>[];
}
