import { ItemsHoldr } from "itemsholdr";

import { EightBittr } from "../EightBittr";

export const createItemsHolder = (eightBitter: EightBittr) =>
    new ItemsHoldr(eightBitter.settings.components.itemsHolder);
