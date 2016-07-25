/// <reference path="../../lib/InputWritr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockInputWritr: (settings?: InputWritr.IInputWritrSettings): InputWritr.IInputWritr => {
        return new InputWritr.InputWritr(settings);
    }
};
