import { ItemsHoldr } from "itemsholdr";

import { GameStartr } from "../GameStartr";

export const createItemsHolder = (gameStarter: GameStartr) =>
    new ItemsHoldr(gameStarter.settings.components.items);
