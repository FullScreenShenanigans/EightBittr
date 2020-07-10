import { createStorage, IItemsHoldrSettings, ItemsHoldr } from "itemsholdr";

import { StateHoldr } from "./StateHoldr";
import { ICollection, IStateHoldrSettings } from "./types";

/**
 * @param [settings]   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export const stubItemsHoldr = (settings: IItemsHoldrSettings = {}) => {
    const storage = settings.storage === undefined ? createStorage() : settings.storage;

    const itemsHolder = new ItemsHoldr({
        storage,
        ...settings,
    });

    return { itemsHolder, storage };
};

/**
 * @param [settings]   Settings for the StateHoldr.
 * @returns An StateHoldr instance.
 */
export const stubStateHoldr = (settings: IStateHoldrSettings = {}) => {
    const { storage, itemsHolder } = stubItemsHoldr();

    const stateHolder = new StateHoldr({
        itemsHolder,
        ...settings,
    });

    return { itemsHolder, stateHolder, storage };
};

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
