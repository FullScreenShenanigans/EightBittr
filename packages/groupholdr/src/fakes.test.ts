import { GroupHoldr } from "./GroupHoldr";
import { IGroupTypes, IThing } from "./IGroupHoldr";

export const stubGroupHoldr = <TGroupTypes extends IGroupTypes<IThing>>(
    groupNames: string[] = []
) => new GroupHoldr<TGroupTypes>({ groupNames });
