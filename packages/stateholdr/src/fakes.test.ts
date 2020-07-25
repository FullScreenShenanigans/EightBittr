import { createStorage, ItemsHoldrSettings, ItemsHoldr } from "itemsholdr";

import { StateHoldr } from "./StateHoldr";
import { Collection, StateHoldrSettings } from "./types";

/**
 * @param [settings]   Settings for the ItemsHoldr.
 * @returns An ItemsHoldr instance.
 */
export const stubItemsHoldr = (settings: ItemsHoldrSettings = {}) => {
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
export const stubStateHoldr = (settings: StateHoldrSettings = {}) => {
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
export const stubCollection = (): Collection => ({
    car: {
        color: "red",
    },
});

/**
 * @returns A changed collection of mockCollection.
 */
export const stubChangedCollection = (): Collection => ({
    car: {
        color: "blue",
    },
});
