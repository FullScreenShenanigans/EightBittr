define(["ModAttachr"], function (ModAttachrModule) {
    var ModAttachr = ModAttachrModule.ModAttachr;

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
        mockModAttachr: function (settings) {
            return new ModAttachr(settings)
        }
    };

    return mocks;
});
