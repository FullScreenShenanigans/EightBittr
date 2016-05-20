define(["StateHoldr"], function (StateHoldrModule) {
    var StateHoldr = StateHoldrModule.StateHoldr;

    var mocks = {
        /**
         * 
         */
        mockStateHoldr: function (settings) {
            return new StateHoldr(settings)
        }
    };

    return mocks;
});
