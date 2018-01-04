import { GroupHoldr } from "groupholdr";

import { GameStartr } from "../gamestartr";

export const createGroupHolder = (gameStarter: GameStartr) =>
    new GroupHoldr<any>({
        ...gameStarter.settings.components.groups,
    });
