/// <reference path="../../lib/DeviceLayr.d.ts" />
/// <reference path="../../typings/InputWritr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockInputWritr: (settings: InputWritr.IInputWritrSettings): InputWritr.IInputWritr => {
        return new InputWritr.InputWritr(settings);
    }
};
