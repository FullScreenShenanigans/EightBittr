import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../IEightBittr";

export const createGroupHolder = (eightBitter: EightBittr) =>
    new GroupHoldr<{ [i: string]: IThing }>({
        ...eightBitter.settings.components.groupHolder,
    });
