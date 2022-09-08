/**
 * Either a value, directly, or an array of weighted random options for the value.
 */
export type FixedOrRandomized<Value> = Value | RandomizedValue<Value>[];

/**
 * Weighted random option for a value.
 */
export interface RandomizedValue<Value> {
    /**
     * How likely this option is to be chosen, out of 100.
     */
    probability: number;

    /**
     * Value for if this option is chosen.
     */
    value: Value;
}

/**
 * Object type transform where all properties can be weighted random arrays.
 */
export type FixedOrRandomizedProperties<Values> = FixedOrRandomized<{
    [K in keyof Values]: FixedOrRandomized<Exclude<Values[K], undefined>>;
}>;

/**
 * Random number generator that returns a decimal within [0, 1).
 *
 * @returns Random decimal within [0, 1).
 */
export type RandomNumberGenerator = () => number;

/**
 * Random number generator that returns a decimal within [min, max).
 *
 * @param min   Minimum return value.
 * @param max   Maximum return value.
 * @returns Random decimal within [min, max).
 */
export type RandomNumberBetweenGenerator = (min: number, max: number) => number;
