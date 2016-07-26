/// <reference path="../../lib/NumberMakr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the NumberMakr.
     * @returns An NumberMakr instance.
     */
    mockNumberMakr: (settings?: NumberMakr.INumberMakrSettings): NumberMakr.INumberMakr => {
        return new NumberMakr.NumberMakr(settings);
    }
};
