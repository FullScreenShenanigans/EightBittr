define(["InputWritr"], function (InputWritrModule) {
    var InputWritr = InputWritrModule.InputWritr;

    var mocks = {
        /**
         * 
         */
        mockInputWritr: function (settings) {
            return new InputWritr(settings)
        }
    };

    return mocks;
});
