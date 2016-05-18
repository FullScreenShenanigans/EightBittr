define(["FPSAnalyzr"], function (FPSAnalyzrModule) {
    var FPSAnalyzr = FPSAnalyzrModule.FPSAnalyzr;

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
        mockFPSAnalyzr: function (settings) {
            return new FPSAnalyzr(settings)
        }
    };

    return mocks;
});
