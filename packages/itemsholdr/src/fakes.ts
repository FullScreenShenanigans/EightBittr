import { IItemsHoldr, IItemsHoldrSettings } from "./IItemsHoldr";
import { IItemValue } from "./IItemValue";
import { ItemsHoldr } from "./ItemsHoldr";
import { ItemValue } from "./ItemValue";

/**
 * @param itemsHolder   ItemsHolder object.
 * @param key   Key for the item.
 * @param settings   Settings for the ItemValue.
 * @returns An ItemValue instance.
 */
export const stubItemValue = (itemsHolder: IItemsHoldr, key: string, settings?: any): IItemValue =>
    new ItemValue(itemsHolder, key, settings);

/**
 * @param settings   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export const stubItemsHoldr = (settings?: IItemsHoldrSettings): IItemsHoldr =>
    new ItemsHoldr(settings);

/**
 * @returns An object with a valueDefault property for ItemValue object instantiation.
 */
export const stubItemValueSettings = () => ({
    valueDefault: "red",
});
