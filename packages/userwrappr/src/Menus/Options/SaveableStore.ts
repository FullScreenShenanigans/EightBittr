import { action, computed, observable } from "mobx";

import { ISaveableSchema } from "./OptionSchemas";
import { OptionStore } from "./OptionStore";

export type GetSchemaValue<TSchema> = TSchema extends ISaveableSchema<infer U> ? U : never;

/**
 * Store for a state whose value is saved locally.
 *
 * @template TValue   Type of the value.
 * @template TSchema   Type of the parent option schema.
 */
export class SaveableStore<
    TSchema extends ISaveableSchema<any> = ISaveableSchema<unknown>
> extends OptionStore<TSchema> {
    /**
     * Current state of the value.
     */
    @observable
    private currentValue = this.schema.getInitialValue();

    /**
     * Gets the current state of the value.
     */
    @computed
    public get value(): GetSchemaValue<TSchema> {
        return this.currentValue;
    }

    /**
     * Sets a new state for the value.
     *
     * @param newValue   New state for the value.
     */
    @action
    public setValue = (newValue: GetSchemaValue<TSchema>): void => {
        const oldValue = this.currentValue;
        this.currentValue = newValue;
        this.schema.saveValue(newValue, oldValue);
    };
}
