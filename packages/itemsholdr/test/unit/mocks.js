define(["ItemsHoldr", "ItemValue"], function (ItemsHoldrModule, ItemValueModule) {
    var ItemsHoldr = ItemsHoldrModule.ItemsHoldr;
    var ItemValue = ItemValueModule.ItemValue;

    var mocks = {
        /**
         * @param [ItemsHoldrObject]   ItemsHoldr object.
         * @param [key]   Key for the item.
         * @param [settings]   Settings for the ItemValue.
         * @returns An ItemValue instance.
         */
        mockItemValue: function (ItemsHoldrObject, key, settings) {
            return new ItemValue(ItemsHoldrObject, key, settings);
        },
        /**
         * @param [settings]   Settings for the ItemsHoldr.
         * @returns An ItemsHoldr instance.
         */
        mockItemsHoldr: function (settings) {
            return new ItemsHoldr(settings);
        },
        /**
         * @returns An object with a valueDefault property for ItemValue object instantiation.
         */
        mockItemValueSettings: function () {
            return { valueDefault: "red" };
        }
    };

    return mocks;
});
