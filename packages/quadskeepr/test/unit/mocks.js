define(["QuadsKeepr"], function (QuadsKeeprModule) {
    var QuadsKeepr = QuadsKeeprModule.QuadsKeepr;

    var mocks = {
        /**
         * 
         */
        mockQuadsKeepr: function (settings) {
            return new QuadsKeepr(settings)
        }
    };

    return mocks;
});
