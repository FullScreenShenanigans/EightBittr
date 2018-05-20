import { GroupHoldr } from "groupholdr";

import { EightBittr } from "../EightBittr";

export const createGroupHolder = (eightBitter: EightBittr) =>
    new GroupHoldr<any>({
        ...eightBitter.settings.components.groups,
    });
