define(["StateHoldr", "ItemsHoldr"], function (StateHoldrModule, ItemsHoldrModule) {
    var StateHoldr = StateHoldrModule.StateHoldr;
    var ItemsHoldr = ItemsHoldrModule.ItemsHoldr;

    var mocks = {
        /**
         * @param [settings]   Settings for the StateHoldr.
         * @returns An StateHoldr instance.
         */
        mockStateHoldr: function (settings) {
            return new StateHoldr(settings || {
                ItemsHolder: new ItemsHoldr()
            })
        },
        /**
         * @param [settings]   Settings for the ItemsHoldr.
         * @returns An ItemsHoldr instance.
         */
        mockItemsHoldr: function (settings) {
            return new ItemsHoldr(settings)
        },
        /**
         * @returns An example collection object.
         */
        mockCollection: function () {
            return {
                car: {
                    color: "red"
                }};
        },
        /**
         * @returns A changed collection of mockCollection.
         */
        mockChangedCollection: function () {
            return {
                car: {
                    color: "blue"
                }}
        }
    };

    return mocks;
});
