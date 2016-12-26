import { IItemsHoldr, IItemsHoldrSettings } from "../../src/IItemsHoldr";
import { IItemValue } from "../../src/IItemValue";
import { ItemsHoldr } from "../../src/ItemsHoldr";
import { ItemValue } from "../../src/ItemValue";

/**
 * @param ItemsHolder   ItemsHolder object.
 * @param key   Key for the item.
 * @param settings   Settings for the ItemValue.
 * @returns An ItemValue instance.
 */
export function stubItemValue(ItemsHolder: IItemsHoldr, key: string, settings?: any): IItemValue {
    return new ItemValue(ItemsHolder, key, settings);
}

/**
 * @param settings   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export function stubItemsHoldr(settings?: IItemsHoldrSettings): IItemsHoldr {
    return new ItemsHoldr(settings);
}

/**
 * @returns An object with a valueDefault property for ItemValue object instantiation.
 */
export function stubItemValueSettings(): any {
    return {
        valueDefault: "red"
    };
}
