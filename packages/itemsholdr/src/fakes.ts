import { createStorage } from "./createStorage";
import { ItemsHoldr } from "./ItemsHoldr";
import { ItemsHoldrSettings } from "./types";

/**
 * Creates a stub ItemsHoldr for testing.
 *
 * @param settings   Settings for the ItemsHoldr.
 * @returns Stub ItemsHoldr and its storage.
 */
export const stubItemsHoldr = (settings?: ItemsHoldrSettings) => {
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
