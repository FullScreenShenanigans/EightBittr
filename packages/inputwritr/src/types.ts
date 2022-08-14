/**
 * A callback for when a piped event is triggered.
 *
 * @param event   The source Event causing the trigger.
 */
export type TriggerCallback = (event?: Event) => void;

/**
 * A mapping of events to their key codes, to their callbacks.
 */
export type TriggerContainer = Record<string, TriggerGroup>;

/**
 * A mapping of key codes to callbacks.
 */
export interface TriggerGroup {
    [i: string]: TriggerCallback;
    [j: number]: TriggerCallback;
}

/**
 * Known, allowed aliases for triggers.
 */
export type Aliases = Record<string, (number | string)[]>;

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
export type CanTrigger = (
    event: Function | string,
    keyCode?: number | string,
    sourceEvent?: Event
) => boolean;

/**
 * A mapping from alias Strings to character code Numbers.
 */
export type AliasesToCodes = Record<string, number>;

/**
 * A mapping from character code Numbers to alias Strings.
 */
export type CodesToAliases = Record<number, string>;

/**
 * Aliases mapped to their allowed key strings.
 */
export type AliasKeys = Record<string, string[]>;

/**
 * Pipes an input event to the correct trigger.
 *
 * @param event   An input event.
 */
export type Pipe = (event: Event) => void;

/**
 * Settings to initialize a new InputWritr.
 */
export interface InputWritrSettings {
    /**
     * The mapping of events to their key codes, to their callbacks.
     */
    triggers?: TriggerContainer;

    /**
     * Function to generate a current timestamp, commonly performance.now.
     */
    getTimestamp?(): number;

    /**
     * Known, allowed aliases for triggers.
     */
    aliases?: Aliases;

    /**
     * Whether events are initially allowed to trigger (by default, true).
     */
    canTrigger?: boolean | CanTrigger;
}
