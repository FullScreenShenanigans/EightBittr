/**
 * Event names for mods.
 */
export interface IEventNames {
    /*
     * Key for event when a mod is enabled.
     */
    onModEnable: string;

    /*
     * Key for event when a mod is disabled.
     */
    onModDisable: string;
}

/**
 * Event names for mods.
 */
export class EventNames implements IEventNames {
    /*
     * Key for event when a mod is enabled.
     */
    public readonly onModEnable = "onModEnable";

    /*
     * Key for event when a mod is disabled.
     */
    public readonly onModDisable = "onModDisable";
}
