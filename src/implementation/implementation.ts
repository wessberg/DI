import { NewableService } from "../newable-service/newable-service";
import { CustomConstructableService } from "../custom-constructable-service/custom-constructable-service";
import { IWithConstructorArgumentsSymbol } from "../constructor-arguments/constructor-argument";

export type Implementation<T> = NewableService<T> &
  IWithConstructorArgumentsSymbol;
export type ImplementationInstance<T> = CustomConstructableService<T> &
  IWithConstructorArgumentsSymbol;
