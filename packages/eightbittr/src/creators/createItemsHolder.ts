import { ItemsHoldr } from "itemsholdr";

import { EightBittr } from "../EightBittr";

export const createItemsHolder = (game: EightBittr) =>
    new ItemsHoldr({
        prefix: game.items.prefix,
        values: game.items.values,
        ...game.settings.components.itemsHolder,
    });
