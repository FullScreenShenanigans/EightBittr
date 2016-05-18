define(["ItemsHoldr"], function (ItemsHoldrModule) {
    var ItemsHoldr = ItemsHoldrModule.ItemsHoldr;

    var mocks = {
        /**
         * 
         */
        mockItemValue: function (settings) {
            return new ItemValue(settings)
        },
        /**
         * 
         */
        mockItemsHoldr: function (settings) {
            return new ItemsHoldr(settings)
        }
    };

    return mocks;
});
