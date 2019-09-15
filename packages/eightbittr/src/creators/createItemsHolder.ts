import { ItemsHoldr } from "itemsholdr";

import { EightBittr } from "../EightBittr";

export const createItemsHolder = (eightBitter: EightBittr) =>
    new ItemsHoldr({
        prefix: eightBitter.items.prefix,
        values: eightBitter.items.values,
        ...eightBitter.settings.components.itemsHolder,
    });
