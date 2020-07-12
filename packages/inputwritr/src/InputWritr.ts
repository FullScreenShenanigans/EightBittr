import { AliasConverter } from "./AliasConverter";
import {
    IAliases,
    ICanTrigger,
    IInputWritrSettings,
    IPipe,
    ITriggerCallback,
    ITriggerContainer,
    ITriggerGroup,
} from "./types";

/**
 * Pipes input events to action callbacks.
 */
export class InputWritr {
    /**
     * Converts between character aliases and their key strings.
     */
    public readonly aliasConverter: AliasConverter;

    /**
     * A mapping of events to their key codes, to their callbacks.
     */
    private readonly triggers: ITriggerContainer;

    /**
     * Known, allowed aliases for triggers.
     */
    private readonly aliases: IAliases;

    /**
     * An optional Boolean callback to disable or enable input triggers.
     */
    private readonly canTrigger: ICanTrigger;

    /**
     * Initializes a new instance of the InputWritr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IInputWritrSettings = {}) {
        this.triggers = settings.triggers || {};

        if ("canTrigger" in settings) {
            this.canTrigger =
                typeof settings.canTrigger === "function"
                    ? settings.canTrigger
                    : () => settings.canTrigger as boolean;
        } else {
            this.canTrigger = () => true;
        }

        this.aliases = {};
        this.aliasConverter = new AliasConverter(this.aliases);
        this.addAliases(settings.aliases || {});
    }

    /**
     * Adds a list of values by which an event may be triggered.
     *
     * @param name   The name of the event that is being given aliases,
     *               such as "left".
     * @param values   An array of aliases by which the event will also
     *                 be callable.
     */
    public addAliasValues(name: any, values: any[]): void {
        if (!this.aliases[name]) {
            this.aliases[name] = values;
        } else {
            this.aliases[name].push.apply(this.aliases[name], values);
        }

        // TriggerName = "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            // TriggerGroup = { "left": function, ... }, ...
            const triggerGroup: ITriggerGroup = this.triggers[triggerName];

            if (triggerGroup[name]) {
                // Values[i] = 37, 65, ...
                for (const value of values) {
                    triggerGroup[value] = triggerGroup[name];
                }
            }
        }
    }

    /**
     * Removes a list of values by which an event may be triggered.
     *
     * @param name   The name of the event that is having aliases removed,
     *               such as "left".
     * @param values   Aliases by which the event will no longer be callable.
     */
    public removeAliasValues(name: string, values: any[]): void {
        if (!this.aliases[name]) {
            return;
        }

        for (const value of values) {
            this.aliases[name].splice(this.aliases[name].indexOf(value, 1));
        }

        // TriggerName = "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            // TriggerGroup = { "left": function, ... }, ...
            const triggerGroup: ITriggerGroup = this.triggers[triggerName];

            if (triggerGroup[name]) {
                // Values[i] = 37, 65, ...
                for (const value of values) {
                    if (triggerGroup[value]) {
                        delete triggerGroup[value];
                    }
                }
            }
        }
    }

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
    public switchAliasValues(name: string, valuesOld: any[], valuesNew: any[]): void {
        this.removeAliasValues(name, valuesOld);
        this.addAliasValues(name, valuesNew);
    }

    /**
     * Adds a set of alises from an Object containing "name" => [values] pairs.
     *
     * @param aliasesRaw   Aliases to be added via this.addAliasvalues.
     */
    public addAliases(aliasesRaw: any): void {
        for (const aliasName in aliasesRaw) {
            this.addAliasValues(aliasName, aliasesRaw[aliasName]);
        }
    }

    /**
     * Adds a triggerable event by marking a new callback under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param trigger   The name of the triggered event.
     * @param label   The code within the trigger to call within,
     *                typically either a character code or an alias.
     * @param callback   The callback Function to be triggered.
     */
    public addEvent(trigger: string, label: string, callback: ITriggerCallback): void {
        if (!this.triggers[trigger]) {
            throw new Error(`Unknown trigger requested: '${trigger}'.`);
        }

        this.triggers[trigger][label] = callback;

        if (this.aliases[label]) {
            for (const alias of this.aliases[label]) {
                this.triggers[trigger][alias] = callback;
            }
        }
    }

    /**
     * Removes a triggerable event by deleting any callbacks under the trigger's
     * triggers. Any aliases for the label are also given the callback.
     *
     * @param trigger   The name of the triggered event.
     * @param label   The code within the trigger to call within,
     *                typically either a character code or an alias.
     */
    public removeEvent(trigger: string, label: string): void {
        if (!this.triggers[trigger]) {
            throw new Error(`Unknown trigger requested: '${trigger}'.`);
        }

        delete this.triggers[trigger][label];

        if (this.aliases[label]) {
            for (const alias of this.aliases[label]) {
                if (this.triggers[trigger][alias]) {
                    delete this.triggers[trigger][alias];
                }
            }
        }
    }

    /**
     * Primary driver function to run a triggers event.
     *
     * @param eventRaw   The event function (or string alias thereof) to call.
     * @param keyCode   The alias of the event Function under triggers[event],
     *                  if event is a string.
     * @param sourceEvent   The raw event that caused the calling Pipe
     *                      to be triggered, such as a MouseEvent.
     * @returns The result of calling the triggered event.
     */
    public callEvent(
        eventRaw: Function | string,
        keyCode?: number | string,
        sourceEvent?: Event
    ): any {
        if (!eventRaw) {
            throw new Error("Blank event given to InputWritr.");
        }

        if (!this.canTrigger(eventRaw, keyCode, sourceEvent)) {
            return;
        }

        const event =
            typeof eventRaw === "string" ? this.triggers[eventRaw][keyCode as string] : eventRaw;

        return event(sourceEvent);
    }

    /**
     * Creates and returns a pipe to run a trigger.
     *
     * @param trigger   The label for the array of functions that the
     *                  pipe function should choose from.
     * @param codeLabel   A mapping string for the alias to get the
     *                    alias from the event.
     * @param preventDefaults   Whether the input to the pipe Function
     *                           will be an DOM-style event, where
     *                           .preventDefault() should be called.
     * @returns A Function that, when called on an event, runs this.callEvent
     *          on the appropriate trigger event.
     */
    public makePipe(trigger: string, codeLabel: string, preventDefaults?: boolean): IPipe {
        const functions: ITriggerGroup = this.triggers[trigger];
        if (!functions) {
            throw new Error(`No trigger of label '${trigger}' defined.`);
        }

        return (event: Event): void => {
            const alias: number | string = (event as any)[codeLabel];

            // Typical usage means alias will be an event from a key/mouse input
            if (preventDefaults && event.preventDefault instanceof Function) {
                event.preventDefault();
            }

            // If there's a Function under that alias, run it
            if (functions[alias]) {
                this.callEvent(functions[alias], alias, event);
            }
        };
    }
}
