import { IAliasConverter } from "./IAliasConverter";

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
 * Settings to initialize a new IInputWritr.
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

/**
 * Bridges input events to known actions.
 */
export interface IInputWritr {
    /**
     * Converts between character aliases and their key strings.
     */
    readonly aliasConverter: IAliasConverter;

    /**
     * Adds a list of values by which an event may be triggered.
     *
     * @param name   The name of the event that is being given aliases,
     *               such as "left".
     * @param values   An array of aliases by which the event will also
     *                 be callable.
     */
    addAliasValues(name: any, values: any[]): void;

    /**
     * Removes a list of values by which an event may be triggered.
     *
     * @param name   The name of the event that is having aliases removed,
     *               such as "left".
     * @param values   Aliases by which the event will no longer be callable.
     */
    removeAliasValues(name: string, values: any[]): void;

    /**
     * Shortcut to remove old alias values and add new ones in.
     *
     * @param name   The name of the event that is having aliases
     *               added and removed, such as "left".
     * @param valuesOld   An array of aliases by which the event will no
     *                    longer be callable.
     * @param valuesNew   An array of aliases by which the event will
     *                    now be callable.
     */
    switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void;

    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     *
     * @param aliasesRaw   Aliases to be added via this.addAliasvalues.
     */
    addAliases(aliasesRaw: any): void;

    /**
     * Adds a triggerable event by marking a new callback under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param trigger   The name of the triggered event.
     * @param label   The code within the trigger to call within,
     *                typically either a character code or an alias.
     * @param callback   The callback Function to be triggered.
     */
    addEvent(trigger: string, label: string, callback: ITriggerCallback): void;

    /**
     * Removes a triggerable event by deleting any callbacks under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param trigger   The name of the triggered event.
     * @param label   The code within the trigger to call within,
     *                typically either a character code or an alias.
     */
    removeEvent(trigger: string, label: string): void;

    /**
     * Primary driver function to run a triggers event.
     *
     * @param eventRaw   The event function (or string alias thereof) to call.
     * @param keyCode   The alias of the event function under triggers[event],
     *                  if event is a string.
     * @param sourceEvent   The raw event that caused the calling Pipe
     *                      to be triggered, such as a MouseEvent.
     * @returns The result of calling the triggered event.
     */
    callEvent(
        eventRaw: Function | string,
        keyCode?: number | string,
        sourceEvent?: Event
    ): any;

    /**
     * Creates and returns a Function to run a trigger.
     *
     * @param trigger   The label for the array of functions that the
     *                  pipe function should choose from.
     * @param codeLabel   A mapping string for the alias to get the
     *                    alias from the event.
     * @param preventDefaults   Whether the input to the pipe Function
     *                          will be an DOM-style event, where
     *                          .preventDefault() should be called.
     * @returns A Function that, when called on an event, runs this.callEvent
     *          on the appropriate trigger event.
     */
    makePipe(
        trigger: string,
        codeLabel: string,
        preventDefaults?: boolean
    ): IPipe;
}
