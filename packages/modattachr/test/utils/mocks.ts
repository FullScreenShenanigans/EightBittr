/// <reference path="../../lib/ModAttachr.d.ts" />

const mocks = {
    /**
     * @param settings   Settings for the ModAttachr.
     * @returns An ModAttachr instance.
     */
    mockModAttachr: (settings?: ModAttachr.IModAttachrSettings): ModAttachr.IModAttachr => {
        return new ModAttachr.ModAttachr(settings);
    }
};
