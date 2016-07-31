/// <reference path="../../lib/TimeHandlr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockTimeHandlr: (settings: TimeHandlr.ITimeHandlrSettings = mocks.mockTimeHandlrSettings): TimeHandlr.ITimeHandlr => {
        return new TimeHandlr.TimeHandlr(settings);
    }
};
