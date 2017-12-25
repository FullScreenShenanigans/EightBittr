import { IItemsHoldrSettings, ItemsHoldr } from "itemsholdr";

import { ICollection, IStateHoldrSettings } from "./IStateHoldr";
import { StateHoldr } from "./StateHoldr";

/**
 * @param [settings]   Settings for the StateHoldr.
 * @returns An StateHoldr instance.
 */
export const stubStateHoldr = (settings?: IStateHoldrSettings) =>
    new StateHoldr(settings);

/**
 * @param [settings]   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export const stubItemsHoldr = (settings?: IItemsHoldrSettings) =>
    new ItemsHoldr(settings);

/**
 * @returns An example collection object.
 */
export const stubCollection = (): ICollection => ({
    car: {
        color: "red",
    },
});

/**
 * @returns A changed collection of mockCollection.
 */
export const stubChangedCollection = (): ICollection => ({
    car: {
        color: "blue",
    },
});
