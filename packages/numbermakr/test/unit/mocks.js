define(["NumberMakr"], function (NumberMakrModule) {
    var NumberMakr = NumberMakrModule.NumberMakr;

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
        mockNumberMakr: function (settings) {
            return new NumberMakr(settings)
        }
    };

    return mocks;
});
