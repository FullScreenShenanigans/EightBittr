/**
 * Individual option schema within a menu.
 */
export type OptionSchema =
    | ActionSchema
    | BooleanSchema
    | MultiSelectSchema
    | NumberSchema
    | SelectSchema
    | StringSchema
    | UnknownSchema;

/**
 * Type of an option schema.
 */
export enum OptionType {
    /**
     * Simple triggerable action.
     */
    Action = "action",

    /**
     * Boolean toggle state.
     */
    Boolean = "boolean",

    /**
     * Multiple selections of given preset values.
     */
    MultiSelect = "multi-select",

    /**
     * Numeric value within a range.
     */
    Number = "number",

    /**
     * One of given preset values.
     */
    Select = "select",

    /**
     * Any string value.
     */
    String = "string",

    /**
     * Unknown or unsupported value.
     */
    Unknown = "unknown",
}

/**
 * Basic details for option schemas.
 */
export interface BasicSchema {
    /**
     * Displayed title of the option.
     */
    title: string;

    /**
     * Type of the option.
     */
    type: OptionType;
}

/**
 * Option that just calls an action.
 */
export interface ActionSchema extends BasicSchema {
    /**
     * Action the option will call.
     */
    action(): void;

    /**
     * Type of the action (action).
     */
    type: OptionType.Action;
}

/**
 * Schema for an option whose value is saved locally.
 *
 * @template TValue   Type of the value.
 */
export interface SaveableSchema<TValue> extends BasicSchema {
    /**
     * @returns An initial state for the value.
     */
    getInitialValue(): TValue;

    /**
     * Saves a new state value.
     *
     * @param newValue   New state for the value.
     * @param oldValue   Old state for the value.
     */
    saveValue(newValue: TValue, oldValue: TValue): void;
}

/**
 * Option that stores a boolean value.
 */
export interface BooleanSchema extends SaveableSchema<boolean> {
    /**
     * Type of the option (boolean).
     */
    type: OptionType.Boolean;
}

/**
 * Option that stores multiple options within preset values.
 */
export interface MultiSelectSchema extends SaveableSchema<string[]> {
    /**
     * Given preset values.
     */
    options: string[];

    /**
     * How many of the preset options must be chosen at once.
     */
    selections: number;

    /**
     * Type of the option (select).
     */
    type: OptionType.MultiSelect;
}

/**
 * Option that stores a numeric value.
 */
export interface NumberSchema extends SaveableSchema<number> {
    /**
     * Maximum numeric value, if any.
     */
    maximum?: number;

    /**
     * Minimum numeric value, if any.
     */
    minimum?: number;

    /**
     * Type of the option (numeric).
     */
    type: OptionType.Number;
}

/**
 * Option that stores one of its preset values.
 */
export interface SelectSchema extends SaveableSchema<string> {
    /**
     * Given preset values.
     */
    options: string[];

    /**
     * Type of the option (select).
     */
    type: OptionType.Select;
}

/**
 * Option that stores a string value.
 */
export interface StringSchema extends SaveableSchema<string> {
    /**
     * Type of the option (string).
     */
    type: OptionType.String;
}

/**
 * Unknown option type.
 */
export interface UnknownSchema extends BasicSchema {
    /**
     * Type of the option (unknown).
     */
    type: OptionType.Unknown;
}
