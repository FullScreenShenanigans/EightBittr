/**
 * A callback for when a piped event is triggered.
 *
 * @param event   The source Event causing the trigger.
 */
export type ITriggerCallback = (event?: Event) => void;

/**
 * A mapping of events to their key codes, to their callbacks.
 */
export interface ITriggerContainer {
    [i: string]: ITriggerGroup;
}

/**
 * A mapping of key codes to callbacks.
 */
export interface ITriggerGroup {
    [i: string]: ITriggerCallback;
    [j: number]: ITriggerCallback;
}

/**
 * Known, allowed aliases for triggers.
 */
export interface IAliases {
    [i: string]: any[];
}

/**
 * Determines whether triggering is possible for an event.
 *
 * @param event   The event function (or string alias thereof) to call.
 * @param keyCode   The alias of the event Function under triggers[event],
 *                  if event is a string.
 * @param sourceEvent   The raw event that caused the calling Pipe
 *                      to be triggered, such as a MouseEvent.
 * @returns Whether triggering is possible.
 */
export type ICanTrigger = (
    event: Function | string,
    keyCode?: number | string,
    sourceEvent?: Event
) => boolean;

/**
 * A mapping from alias Strings to character code Numbers.
 */
export interface IAliasesToCodes {
    [i: string]: number;
}

/**
 * A mapping from character code Numbers to alias Strings.
 */
export interface ICodesToAliases {
    [i: number]: string;
}

/**
 * Aliases mapped to their allowed key strings.
 */
export interface IAliasKeys {
    [i: string]: string[];
}

/**
 * Pipes an input event to the correct trigger.
 *
 * @param event   An input event.
 */
export type IPipe = (event: Event) => void;

/**
 * Settings to initialize a new InputWritr.
 */
export interface IInputWritrSettings {
    /**
     * The mapping of events to their key codes, to their callbacks.
     */
    triggers?: ITriggerContainer;

    /**
     * Function to generate a current timestamp, commonly performance.now.
     */
    getTimestamp?(): number;

    /**
     * Known, allowed aliases for triggers.
     */
    aliases?: IAliases;

    /**
     * Whether events are initially allowed to trigger (by default, true).
     */
    canTrigger?: boolean | ICanTrigger;
}
