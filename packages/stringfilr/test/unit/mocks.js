define(["StringFilr"], function (StringFilrModule) {
    var StringFilr = StringFilrModule.StringFilr;

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
        mockStringFilr: function (settings) {
            return new StringFilr(settings)
        }
    };

    return mocks;
});
