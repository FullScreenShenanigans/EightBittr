import { GroupHoldr } from "groupholdr";

import { GameStartr } from "../GameStartr";

export const createGroupHolder = (gameStarter: GameStartr) =>
    new GroupHoldr<any>({
        ...gameStarter.settings.components.groups,
    });
