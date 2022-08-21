/* eslint-disable @typescript-eslint/no-dynamic-delete */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import {
    Aliases,
    CanTrigger,
    InputWritrSettings,
    Pipe,
    TriggerContainer,
    TriggerGroup,
} from "./types";

/**
 * Pipes input events to action callbacks.
 */
export class InputWritr {
    // TODO correct types.ts comments too
    /**
     * Maps event types to their key codes, to their callbacks.
     */
    private readonly triggers: TriggerContainer;

    /**
     * Maps event types to their lists of aliases.
     */
    private readonly aliases: Aliases;

    /**
     * Determines whether events are allowed to be called.
     */
    private readonly canTrigger: CanTrigger;

    /**
     * Initializes a new instance of the InputWritr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: InputWritrSettings = {}) {
        this.aliases = {};
        this.canTrigger = settings.canTrigger ?? (() => true);
        this.triggers = settings.triggers ?? {};

        if (settings.aliases) {
            for (const aliasName in settings.aliases) {
                this.addEventAliasValues(aliasName, settings.aliases[aliasName]);
            }
        }
    }

    /**
     * Adds a list of values by which an event may be triggered.
     *
     * @param eventType   Event type to be aliased, such as "keyDownLeft".
     * @param values   Aliases by which the event will also be callable, such as [37, 65].
     */
    public addEventAliasValues(eventType: string, values: (number | string)[]): void {
        if (this.aliases[eventType]) {
            this.aliases[eventType].push(...values);
        } else {
            this.aliases[eventType] = values;
        }

        // triggerName: "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            // triggerGroup: { "keyDownLeft": function, ... }, ...
            const triggerGroup = this.triggers[triggerName];

            if (triggerGroup[eventType]) {
                for (const value of values) {
                    triggerGroup[value] = triggerGroup[eventType];
                }
            }
        }
    }

    /**
     * Calls a triggered event under the key code, if it exists.
     *
     * @param eventAlias   The aliased name of the event to call.
     * @param keyCode   The alias of the event Function under triggers[event].
     * @param sourceEvent   The raw event that caused the calling Pipe
     *                      to be triggered, such as a MouseEvent.
     * @returns The result of calling the triggered event.
     */
    public callEvent(eventRaw: string, keyCode: number | string, sourceEvent?: Event): any {
        if (this.canTrigger(eventRaw, keyCode, sourceEvent)) {
            return this.triggers[eventRaw]?.[keyCode as string]?.(sourceEvent);
        }
    }

    /**
     * Creates and returns a pipe to run a trigger.
     *
     * @param type   The label for the array of functions that the
     *                  pipe function should choose from.
     * @param eventKey   A mapping string for the alias to get the
     *                    alias from the event.
     * @param preventDefaults   Whether the input to the pipe Function
     *                           will be an DOM-style event, where
     *                           .preventDefault() should be called.
     * @returns A Function that, when called on an event, runs this.callEvent
     *          on the appropriate trigger event.
     */
    public createPipe(type: string, eventKey: string, preventDefaults?: boolean): Pipe {
        const functions = this.triggers[type];
        if (!functions) {
            throw new Error(`No trigger of type '${type}' defined.`);
        }

        return (event: Event): void => {
            const alias = (event as unknown as Record<string, string>)[eventKey];

            // Typical usage means alias will be an event from a key/mouse input
            if (preventDefaults && event.preventDefault instanceof Function) {
                event.preventDefault();
            }

            this.callEvent(type, alias, event);
        };
    }

    /**
     * Removes a list of values by which an event may be triggered.
     *
     * @param name   The name of the event that is having aliases removed,
     *               such as "left".
     * @param values   Aliases by which the event will no longer be callable.
     */
    public removeEventAliasValues(name: string, values: (number | string)[]): void {
        if (!this.aliases[name]) {
            return;
        }

        for (const value of values) {
            this.aliases[name].splice(this.aliases[name].indexOf(value, 1));
        }

        // TriggerName = "onkeydown", "onkeyup", ...
        for (const triggerName in this.triggers) {
            // TriggerGroup = { "left": function, ... }, ...
            const triggerGroup: TriggerGroup = this.triggers[triggerName];

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
}
