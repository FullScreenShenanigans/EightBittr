import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

export const createGroupHolder = (eightBitter: EightBittr) =>
    new GroupHoldr<{ [i: string]: IThing }>({
        groupNames: eightBitter.groups.groupNames,
        ...eightBitter.settings.components.groupHolder,
    });
