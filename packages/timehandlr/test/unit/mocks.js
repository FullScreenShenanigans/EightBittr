define(["TimeHandlr"], function (TimeHandlrModule) {
    var TimeHandlr = TimeHandlrModule.TimeHandlr;

    var mocks = {
        /**
         * 
         */
        mockTimeHandlr: function (settings) {
            return new TimeHandlr(unitsize)
        }
    };

    return mocks;
});
