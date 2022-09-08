import { FixedOrRandomized, RandomizedValue, RandomNumberGenerator } from "./types";

/**
 * Chooses values from arrays of weighted random values.
 */
export class RandomChooser {
    public constructor(
        /**
         * Random number generator that returns a decimal within [0, 1).
         */
        private readonly random: RandomNumberGenerator
    ) {}

    /**
     * Chooses a value from an array of weighted random values.
     *
     * @param choices   Weighted choices to pick from.
     * @returns Random value from the choices.
     */
    public chooseAmong<Value>(choices: RandomizedValue<Value>[]) {
        const goal = this.randomBetween(0, 100);
        let sum = 0;

        for (const choice of choices) {
            sum += choice.probability;
            if (sum >= goal) {
                return choice.value;
            }
        }

        throw new Error(`Choices only reached sum ${sum} out of goal ${goal}.`);
    }

    /**
     * Chooses a value from either just the value or an array of weighted random values.
     *
     * @param possibility  The value or weighted choices to pick from.
     * @returns Random value from the choices.
     */
    public chooseFixedOrRandom<Value>(possibility: FixedOrRandomized<Value>) {
        return isRandomizedPossibility<Value>(possibility)
            ? this.chooseAmong(possibility)
            : possibility;
    }

    /**
     * Chooses a value from an array of weighted random values, or a default if no values exist.
     *
     * @param possibility  Weighted choices to pick from.
     * @returns Random value from the choices, or the default value.
     */
    public chooseFixedOrRandomOr<Value>(
        possibility: FixedOrRandomized<Value> | undefined,
        defaultValue: Value
    ) {
        return possibility === undefined ? defaultValue : this.chooseFixedOrRandom(possibility);
    }

    /**
     * Random number generator that returns a decimal within [min, max).
     *
     * @param min   Minimum number to return within.
     * @param max   Maximum number to return within.
     * @returns Number within [min, max] at random.
     */
    public randomBetween(min: number, max: number) {
        return Math.floor(this.random() * (max - min + 1)) + min;
    }
}

function isRandomizedPossibility<Value>(
    possibility: FixedOrRandomized<Value>
): possibility is RandomizedValue<Value>[] {
    return Array.isArray(possibility) && "probability" in possibility[0];
}
