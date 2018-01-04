import { ItemsHoldr } from "itemsholdr";

import { GameStartr } from "../gamestartr";

export const createItemsHolder = (gameStarter: GameStartr) =>
    new ItemsHoldr(gameStarter.settings.components.items);
