import { createStorage } from "./createStorage";
import { IItemsHoldrSettings } from "./IItemsHoldr";
import { ItemsHoldr } from "./ItemsHoldr";

/**
 * Creates a stub ItemsHoldr for testing.
 *
 * @param settings   Settings for the ItemsHoldr.
 * @returns Stub ItemsHoldr and its storage.
 */
export const stubItemsHoldr = (settings?: IItemsHoldrSettings) => {
    const storage = createStorage();

    settings = {
        storage,
        ...settings,
    };

    const itemsHolder = new ItemsHoldr(settings);

    return { itemsHolder, storage };
};

/**
 * @returns An object with a valueDefault property for ItemValue object instantiation.
 */
export const stubItemValueSettings = () => ({
    valueDefault: "red",
});
