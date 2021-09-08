/**
 * String direction for positions and bounding boxes.
 */
export type Direction = "top" | "right" | "bottom" | "left";

/**
 * A general listing of possibilities, keyed by title.
 */
export interface PossibilityContainer {
    [i: string]: Possibility;
}

/**
 * Description of what can a title may represent, and its size.
 */
export interface Possibility {
    /**
     * How much horizontal space to reserve for the contents.
     */
    width: number;

    /**
     * How much vertical space to reserve for the contents.
     */
    height: number;

    /**
     * The possible contents to be placed.
     */
    contents: PossibilityContents;
}

/**
 * Possible contents of a possibility, primarily its position
 * within the possibility and what it may contain.
 */
export interface PossibilityContents {
    /**
     * What direction placement of children should move toward.
     */
    direction: Direction;

    /**
     * The method of child generation, from "Random", "Certain",
     * "Repeat", or "Multiple".
     */
    mode: string;

    /**
     * What part of the bounding possibility's position box the
     * children should snap their positions to.
     */
    snap: string;

    /**
     * The potential children of this possibility.
     */
    children: PossibilityChild[];

    /**
     * A description of how much space should be between children.
     */
    spacing?: Spacing;

    /**
     * An optional limit to the number of children to place.
     */
    limit?: number;
}

/**
 * Anyactor that may be chosen from an Array based on its probability.
 */
export interface PercentageOption {
    /**
     * How likely this option is to be chosen, out of 100.
     */
    percent: number;
}

/**
 * An option for an Possibility that describes a recursion
 * to another possibility or a final object to be placed.
 */
export interface PossibilityChild extends PercentageOption {
    /**
     * The identifier of the child, either as a possibility or
     * known object value.
     */
    title: string;

    /**
     * What type of output or possibilities the child contains,
     * as "Known", "Random", or "Final".
     */
    type: string;

    /**
     * Information to pass to generate the child's output.
     */
    arguments?: ArgumentPossibility[] | any;

    /**
     * For type=Final, the possibility with output information.
     */
    source?: string;

    /**
     * How wide and/or tall this should be limited to.
     */
    sizing?: {
        /**
         * How wide this this should be limited to.
         */
        width?: number;

        /**
         * How tall this should be limited to.
         */
        height?: number;
    };

    /**
     * A larger size to stretch the child's output to.
     */
    stretch?: {
        /**
         * A larger width to stretch the child's output to.
         */
        width?: number;

        /**
         * A larger height to stretch the child's output to.
         */
        height?: number;
    };
}

/**
 * A description of a range of possibilities for spacing.
 */
export interface PossibilitySpacing {
    /**
     * A minimum amount for the spacing.
     */
    min: number;

    /**
     * A maximum amount for the spacing.
     */
    max: number;

    /**
     * A Number unit to round to.
     */
    units?: number;
}

/**
 * An option for a spacing range description.
 */
export interface PossibilitySpacingOption extends PercentageOption {
    /**
     * The description of a range of possibilities for spacing.
     */
    value: PossibilitySpacing;
}

/**
 * An option for arguments to add to a choice.
 */
export interface ArgumentPossibility extends PercentageOption {
    /**
     * An Object containing values to add to a choice.
     */
    values: ArgumentMap;
}

/**
 * An Object containing values to add to a choice.
 */
export interface ArgumentMap {
    [i: string]: any;
    width?: any;
    height?: any;
}

/**
 * A mapping of directions to equivalent keys, such as opposites.
 */
export interface DirectionsMap {
    /**
     * The equivalent key for the "top" direction.
     */
    top: string;

    /**
     * The equivalent key for the "right" direction.
     */
    right: string;

    /**
     * The equivalent key for the "bottom" direction.
     */
    bottom: string;

    /**
     * The equivalent key for the "left" direction.
     */
    left: string;
}

/**
 * Specifications for a bounding box size and position.
 */
export interface Position {
    /**
     * How wide the bounding box is, as right - left.
     */
    width: number;

    /**
     * How tall the bounding box is, as top - bottom.
     */
    height: number;

    /**
     * The top border of the bounding box.
     */
    top: number;

    /**
     * The right border of the bounding box.
     */
    right: number;

    /**
     * The bottom border of the bounding box.
     */
    bottom: number;

    /**
     * The left border of the bounding box.
     */
    left: number;
}

/**
 * A command for placing a possibility.
 */
export interface Command extends Position {
    /**
     * The identifier of the possibility.
     */
    title: string;

    /**
     * Arguments to pass to the output of the possibility.
     */
    arguments?: ArgumentMap;
}

/**
 * A final choice for a possibility's output.
 */
export interface Choice extends Command {
    /**
     * What type of output this is, as "Known" or "Random".
     */
    type?: string;

    /**
     * The actual choice contents.
     */
    contents?: Choice;

    /**
     * Potential children to place in the contents.
     */
    children?: Choice[];
}

/**
 * A random number generator that returns a decimal within [0, 1).
 *
 * @returns A random decimal within [0, 1).
 */
export type RandomNumberGenerator = () => number;

/**
 * A random number generator that returns a decimal within [min, max).
 *
 * @param min   Minimum return value.
 * @param max   Maximum return value.
 * @returns A random decimal within [min, max).
 */
export type RandomNumberBetweenGenerator = (min: number, max: number) => number;

/**
 * A general description of possibilities for spacing, as a Number,
 * list of Numbers, possibility, or some combination thereof.
 */
export type Spacing = number | number[] | PossibilitySpacing | PossibilitySpacingOption[];

/**
 * Callback for runGeneratedCommands to place "known" children.
 *
 * @param commands   A set of generated commands to be placed.
 */
export type OnPlacement = (commands: Command[]) => void;

/**
 * Settings to initialize a new IWorldSeedr.
 */
export interface WorldSeedrSettings {
    /**
     * A listing of possibility schemas, keyed by title.
     */
    possibilities?: PossibilityContainer;

    /**
     * Function used to generate a random number, if not Math.random.
     */
    random?: RandomNumberGenerator;

    /**
     * Function called in this.generateFull to place a child.
     */
    onPlacement: OnPlacement;
}
