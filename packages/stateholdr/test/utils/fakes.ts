import { IItemsHoldr, IItemsHoldrSettings } from "itemsholdr/lib/IItemsHoldr";
import { ItemsHoldr } from "itemsholdr/lib/ItemsHoldr";

import { ICollection, IStateHoldr, IStateHoldrSettings } from "../../src/IStateHoldr";
import { StateHoldr } from "../../src/StateHoldr";

/**
 * @param [settings]   Settings for the StateHoldr.
 * @returns An StateHoldr instance.
 */
export function stubStateHoldr(settings?: IStateHoldrSettings): IStateHoldr {
    return new StateHoldr(settings);
}

/**
 * @param [settings]   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export function stubItemsHoldr(settings?: IItemsHoldrSettings): IItemsHoldr {
    return new ItemsHoldr(settings);
}

/**
 * @returns An example collection object.
 */
export function stubCollection(): ICollection {
    return {
        car: {
            color: "red"
        }
    };
}

/**
 * @returns A changed collection of mockCollection.
 */
export function stubChangedCollection(): ICollection {
    return {
        car: {
            color: "blue"
        }
    };
}
