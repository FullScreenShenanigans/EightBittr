/// <reference path="../../lib/FPSAnalyzr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockFPSAnalyzr: (settings?: FPSAnalyzr.IFPSAnalyzrSettings): FPSAnalyzr.IFPSAnalyzr => {
        return new FPSAnalyzr.FPSAnalyzr(settings)
    }
};
