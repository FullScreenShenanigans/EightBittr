import { EventNames } from "../../src/EventNames";
import { IModAttachr, IModAttachrSettings } from "../../src/IModAttachr";
import { ModAttachr } from "../../src/ModAttachr";

/**
 * @param settings   Settings for the ModAttachr.
 * @returns An ModAttachr instance.
 */
export function mockModAttachr(settings?: IModAttachrSettings): IModAttachr {
    return new ModAttachr(settings);
}

/**
 * Holds keys for fake mod events.
 */
export class FakeEventNames extends EventNames {
    /*
     * Key for some arbitrary fake event.
     */
    public readonly fakeEvent: string = "fakeEvent";
}
