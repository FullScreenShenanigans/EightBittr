/// <reference path="../../lib/QuadsKeepr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockQuadsKeepr: (settings?: QuadsKeepr.IQuadsKeeprSettings): QuadsKeepr.IQuadsKeepr<QuadsKeepr.IThing> => {
        return new QuadsKeepr.QuadsKeepr(settings);
    }
};
