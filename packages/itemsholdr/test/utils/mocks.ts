/// <reference path="../../lib/ItemsHoldr.d.ts" />

const mocks = {
    /**
     * @param ItemsHolder   ItemsHolder object.
     * @param key   Key for the item.
     * @param settings   Settings for the ItemValue.
     * @returns An ItemValue instance.
     */
    mockItemValue: (ItemsHolder?: ItemsHoldr.IItemsHoldr, key?: string, settings?: any): ItemsHoldr.IItemValue => {
        return new ItemsHoldr.ItemValue(ItemsHolder, key, settings);
    },

    /**
     * @param settings   Settings for the ItemsHoldr.
     * @returns An ItemsHoldr instance.
     */
    mockItemsHoldr: (settings?: ItemsHoldr.IItemsHoldrSettings): ItemsHoldr.IItemsHoldr => {
        return new ItemsHoldr.ItemsHoldr(settings);
    },

    /**
     * @returns An object with a valueDefault property for ItemValue object instantiation.
     */
    mockItemValueSettings: (): any => {
        return {
            valueDefault: "red"
        };
    }
};
