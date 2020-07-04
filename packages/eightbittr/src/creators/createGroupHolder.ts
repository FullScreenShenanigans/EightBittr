import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";
import { IThing } from "../types";

export const createGroupHolder = (game: EightBittr) =>
    new GroupHoldr<{ [i: string]: IThing }>({
        groupNames: game.groups.groupNames,
        ...game.settings.components.groupHolder,
    });
