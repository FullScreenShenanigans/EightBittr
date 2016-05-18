define(["ChangeLinr"], function (ChangeLinrModule) {
    var ChangeLinr = ChangeLinrModule.ChangeLinr;

    var mocks = {
        /**
         * 
         */
        mockChangeLinr: function (settings) {
            return new ChangeLinr(unitsize)
        }
    };

    return mocks;
});
