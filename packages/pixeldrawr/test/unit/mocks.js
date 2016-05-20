define(["PixelDrawr"], function (PixelDrawrModule) {
    var PixelDrawr = PixelDrawrModule.PixelDrawr;

    var mocks = {
        /**
         * 
         */
        mockPixelDrawr: function (settings) {
            return new PixelDrawr(settings)
        }
    };

    return mocks;
});
