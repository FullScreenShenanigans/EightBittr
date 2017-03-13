import {
    IAliases, IAliasesToCodes, IAliasKeys, IBooleanGetter, ICodesToAliases,
    IInputWritr, IInputWritrSettings, IPipe,
    ITriggerCallback, ITriggerContainer, ITriggerGroup
} from "./IInputWritr";

/**
 * Bridges input events to known actions.
 */
export class InputWritr implements IInputWritr {
    /**
     * A mapping of events to their key codes, to their callbacks.
     */
    private triggers: ITriggerContainer;

    /**
     * Known, allowed aliases for triggers.
     */
    private aliases: IAliases;

    /**
     * Function to generate a current timestamp, commonly performance.now.
     */
    private getTimestamp: () => number;

    /**
     * An optional Boolean callback to disable or enable input triggers.
     */
    private canTrigger: IBooleanGetter;

    /**
     * A quick lookup table of key aliases to their character codes.
     */
    private keyAliasesToCodes: IAliasesToCodes;

    /**
     * A quick lookup table of character codes to their key aliases.
     */
    private keyCodesToAliases: ICodesToAliases;

    /**
     * Initializes a new instance of the InputWritr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IInputWritrSettings = {}) {
        this.triggers = settings.triggers || {};

        // Headless browsers like PhantomJS might not contain the performance
        // class, so Date.now is used as a backup
        if (typeof settings.getTimestamp === "undefined") {
            if (typeof performance === "undefined") {
                this.getTimestamp = function (): number {
                    return Date.now();
                };
            } else {
                this.getTimestamp = (
                    performance.now
                    || (performance as any).webkitNow
                    || (performance as any).mozNow
                    || (performance as any).msNow
                    || (performance as any).oNow
                ).bind(performance);
            }
        } else {
            this.getTimestamp = settings.getTimestamp;
        }

        this.canTrigger = settings.hasOwnProperty("canTrigger")
            ? settings.canTrigger as IBooleanGetter
            : (): boolean => true;

        this.aliases = {};

        this.addAliases(settings.aliases || {});

        this.keyAliasesToCodes = settings.keyAliasesToCodes || {
            shift: 16,
            ctrl: 17,
            space: 32,
            left: 37,
            up: 38,
            right: 39,
            down: 40
        };

        this.keyCodesToAliases = settings.keyCodesToAliases || {
            16: "shift",
            17: "ctrl",
            32: "space",
            37: "left",
            38: "up",
            39: "right",
            40: "down"
        };
    }

    /** 
     * @returns The stored mapping of aliases to values.
     */
    public getAliases(): IAliases {
        return this.aliases;
    }

    /**
     * @returns The stored mapping of aliases to values, with values
     *          mapped to their equivalent key Strings.
     */
    public getAliasesAsKeyStrings(): IAliasKeys {
        const output: IAliasKeys = {};

        for (const alias in this.aliases) {
            output[alias] = this.getAliasAsKeyStrings(alias);
        }

        return output;
    }

    /**
     * Determines the allowed key strings for a given alias.
     * 
     * @param alias   An alias allowed to be passed in, typically a
     *                character code.
     * @returns The mapped key Strings corresponding to that alias,
     *          typically the human-readable Strings representing 
     *          input names, such as "a" or "left".
     */
    public getAliasAsKeyStrings(alias: string): string[] {
        return this.aliases[alias].map<string>(this.convertAliasToKeyString.bind(this));
    }

    /**
     * @param alias   The alias of an input, typically a character code.
     * @returns The human-readable String representing the input name,
     *          such as "a" or "left".
     */
    public convertAliasToKeyString(alias: any): string {
        if (alias.constructor === String) {
            return alias;
        }

        if (alias > 96 && alias < 105) {
            return String.fromCharCode(alias - 48);
        }

        if (alias > 64 && alias < 97) {
            return String.fromCharCode(alias);
        }

        return typeof this.keyCodesToAliases[alias] !== "undefined"
            ? this.keyCodesToAliases[alias]
            : "?";
    }

    /**
     * @param key   The number code of an input.
     * @returns The machine-usable character code of the input.
     */
    public convertKeyStringToAlias(key: number | string): number | string {
        if (typeof key === "number") {
            return key;
        }

        if ((key as string).length === 1) {
            return (key as string).charCodeAt(0) - 32;
        }

        return typeof this.keyAliasesToCodes[key] !== "undefined"
            ? this.keyAliasesToCodes[key as string]
            : -1;
    }

    /**
     * @returns Whether this is currently allowing inputs.
     */
    public getCanTrigger(): IBooleanGetter {
        return this.canTrigger;
    }

    /**
     * Sets whether this is to allow inputs.
     * 
     * @param canTriggerNew   Whether this is now allowing inputs. This 
     *                        may be either a Function (to be evaluated 
     *                        on each input) or a general Boolean.
     */
    public setCanTrigger(canTriggerNew: boolean | IBooleanGetter): void {
        if (typeof canTriggerNew === "boolean") {
            this.canTrigger = (): boolean => canTriggerNew;
        } else {
            this.canTrigger = canTriggerNew;
        }
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
        if (!this.aliases.hasOwnProperty(name)) {
            this.aliases[name] = values;
        } else {
            this.aliases[name].push.apply(this.aliases[name], values);
        }

        // triggerName = "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            if (this.triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                const triggerGroup: ITriggerGroup = this.triggers[triggerName];

                if (triggerGroup.hasOwnProperty(name)) {
                    // values[i] = 37, 65, ...
                    for (const value of values) {
                        triggerGroup[value] = triggerGroup[name];
                    }
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
        if (!this.aliases.hasOwnProperty(name)) {
            return;
        }

        for (const value of values) {
            this.aliases[name].splice(this.aliases[name].indexOf(value, 1));
        }

        // triggerName = "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            if (this.triggers.hasOwnProperty(triggerName)) {
                // triggerGroup = { "left": function, ... }, ...
                const triggerGroup: ITriggerGroup = this.triggers[triggerName];

                if (triggerGroup.hasOwnProperty(name)) {
                    // values[i] = 37, 65, ...
                    for (const value of values) {
                        if (triggerGroup.hasOwnProperty(value)) {
                            delete triggerGroup[value];
                        }
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
            if (aliasesRaw.hasOwnProperty(aliasName)) {
                this.addAliasValues(aliasName, aliasesRaw[aliasName]);
            }
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
        if (!this.triggers.hasOwnProperty(trigger)) {
            throw new Error("Unknown trigger requested: '" + trigger + "'.");
        }

        this.triggers[trigger][label] = callback;

        if (this.aliases.hasOwnProperty(label)) {
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
        if (!this.triggers.hasOwnProperty(trigger)) {
            throw new Error(`Unknown trigger requested: '${trigger}'.`);
        }

        delete this.triggers[trigger][label];

        if (this.aliases.hasOwnProperty(label)) {
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
     * @param event   The event function (or string alias thereof) to call.
     * @param keyCode   The alias of the event Function under triggers[event],
     *                  if event is a string.
     * @param sourceEvent   The raw event that caused the calling Pipe
     *                      to be triggered, such as a MouseEvent.
     * @returns The result of calling the triggered event.
     */
    public callEvent(event: Function | string, keyCode?: number | string, sourceEvent?: Event): any {
        if (!event) {
            throw new Error("Blank event given to InputWritr.");
        }

        if (!this.canTrigger(event, keyCode, sourceEvent)) {
            return;
        }

        if (typeof event === "string") {
            event = this.triggers[event as string][keyCode as string];
        }

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
