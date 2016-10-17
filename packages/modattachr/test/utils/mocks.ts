import { IModAttachr, IModAttachrSettings } from "../../src/IModAttachr";
import { ModAttachr } from "../../src/ModAttachr";

export const mocks = {
    /**
     * @param settings   Settings for the ModAttachr.
     * @returns An ModAttachr instance.
     */
    mockModAttachr: (settings?: IModAttachrSettings): IModAttachr => {
        return new ModAttachr(settings);
    }
};
