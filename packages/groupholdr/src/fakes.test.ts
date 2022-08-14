import { GroupHoldr } from "./GroupHoldr";
import { Actor,GroupTypes } from "./types";

export const stubGroupHoldr = <TGroupTypes extends GroupTypes<Actor>>(
    groupNames: string[] = []
) => new GroupHoldr<TGroupTypes>({ groupNames });
