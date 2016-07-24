/// <reference path="../../lib/ChangeLinr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockChangeLinr: (settings?: ChangeLinr.IChangeLinrSettings): ChangeLinr.IChangeLinr => {
        return new ChangeLinr.ChangeLinr(settings);
    }
};
