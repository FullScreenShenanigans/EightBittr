// This file is referenced in EightBittr documentation.
// If you change it here, please change it there as well!

import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";
import { Actor } from "../types";

export const createGroupHolder = (game: EightBittr) =>
    new GroupHoldr<Record<string, Actor>>({
        groupNames: game.groups.groupNames,
        ...game.settings.components.groupHolder,
    });
