define(["PixelRendr"], function (PixelRendrModule) {
    var PixelRendr = PixelRendrModule.PixelRendr;

    var mocks = {
        /**
         * 
         */
        mockPixelRendr: function (settings) {
            return new PixelRendr(settings)
        }
    };

    return mocks;
});
