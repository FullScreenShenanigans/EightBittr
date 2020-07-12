/**
 * Individual option schema within a menu.
 */
export type IOptionSchema =
    | IActionSchema
    | IBooleanSchema
    | IMultiSelectSchema
    | INumberSchema
    | ISelectSchema
    | IStringSchema
    | IUnknownSchema;

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
export interface IBasicSchema {
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
export interface IActionSchema extends IBasicSchema {
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
export interface ISaveableSchema<TValue> extends IBasicSchema {
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
export interface IBooleanSchema extends ISaveableSchema<boolean> {
    /**
     * Type of the option (boolean).
     */
    type: OptionType.Boolean;
}

/**
 * Option that stores multiple options within preset values.
 */
export interface IMultiSelectSchema extends ISaveableSchema<string[]> {
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
export interface INumberSchema extends ISaveableSchema<number> {
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
export interface ISelectSchema extends ISaveableSchema<string> {
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
export interface IStringSchema extends ISaveableSchema<string> {
    /**
     * Type of the option (string).
     */
    type: OptionType.String;
}

/**
 * Unknown option type.
 */
export interface IUnknownSchema extends IBasicSchema {
    /**
     * Type of the option (unknown).
     */
    type: OptionType.Unknown;
}
