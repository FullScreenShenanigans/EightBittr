/// <reference path="../../lib/QuadsKeepr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockQuadsKeepr: (settings?: QuadsKeepr.IQuadsKeeprSettings): QuadsKeepr.IQuadsKeepr => {
        return new QuadsKeepr.QuadsKeepr(settings);
    }
};
