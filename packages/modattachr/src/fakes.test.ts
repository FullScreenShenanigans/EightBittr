import { EventNames } from "./EventNames";
import { IModAttachrSettings } from "./IModAttachr";
import { ModAttachr } from "./ModAttachr";

/**
 * @param settings   Settings for the ModAttachr.
 * @returns An ModAttachr instance.
 */
export const mockModAttachr = (settings?: IModAttachrSettings) =>
    new ModAttachr(settings);

/**
 * Holds keys for fake mod events.
 */
export class FakeEventNames extends EventNames {
    /*
     * Key for some arbitrary fake event.
     */
    public readonly fakeEvent: string = "fakeEvent";
}
