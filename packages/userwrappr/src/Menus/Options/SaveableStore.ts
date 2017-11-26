import { action, computed, observable } from "mobx";

import { ISaveableSchema } from "./OptionSchemas";
import { OptionStore } from "./OptionStore";

/**
 * Store for a state whose value is saved locally.
 *
 * @template TSchema   Type of the parent option schema.
 * @template TValue   Type of the value.
 */
export class SaveableStore<TSchema extends ISaveableSchema<TValue> = ISaveableSchema<TValue>, TValue = {}> extends OptionStore<TSchema> {
    /**
     * Current state of the value.
     */
    @observable
    private currentValue: TValue = this.schema.getInitialValue();

    /**
     * Gets the current state of the value.
     */
    @computed
    public get value(): TValue {
        return this.currentValue;
    }

    /**
     * Sets a new state for the value.
     *
     * @param newValue   New state for the value.
     */
    @action
    public setValue = (newValue: TValue): void => {
        const oldValue = this.currentValue;
        this.currentValue = newValue;
        this.schema.saveValue(newValue, oldValue);
    }
}
