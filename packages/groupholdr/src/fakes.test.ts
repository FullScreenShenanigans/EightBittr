import { GroupHoldr } from "./GroupHoldr";
import { GroupTypes, Actor } from "./types";

export const stubGroupHoldr = <TGroupTypes extends GroupTypes<Actor>>(
    groupNames: string[] = []
) => new GroupHoldr<TGroupTypes>({ groupNames });
