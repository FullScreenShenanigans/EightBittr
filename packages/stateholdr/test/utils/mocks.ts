/// <reference path="../../lib/StateHoldr.d.ts" />
/// <reference path="../../typings/ItemsHoldr.d.ts" />

const mocks = {
    /**
     * @param [settings]   Settings for the StateHoldr.
     * @returns An StateHoldr instance.
     */
    mockStateHoldr: (settings?: StateHoldr.IStateHoldrSettings): StateHoldr.IStateHoldr => {
        return new StateHoldr.StateHoldr(settings || {
            ItemsHolder: new ItemsHoldr.ItemsHoldr()
        })
    },

    /**
     * @param [settings]   Settings for the ItemsHoldr.
     * @returns An ItemsHoldr instance.
     */
    mockItemsHoldr: (settings?: ItemsHoldr.IItemsHoldrSettings): ItemsHoldr.IItemsHoldr => {
        return new ItemsHoldr.ItemsHoldr(settings)
    },

    /**
     * @returns An example collection object.
     */
    mockCollection: (): StateHoldr.ICollection => {
        return {
            car: {
                color: "red"
            }};
    },

    /**
     * @returns A changed collection of mockCollection.
     */
    mockChangedCollection: (): StateHoldr.ICollection => {
        return {
            car: {
                color: "blue"
            }}
    }
};
