/**
 * String direction for positions and bounding boxes.
 */
export type Direction = "top" | "right" | "bottom" | "left";

/**
 * A general listing of possibilities, keyed by title.
 */
export interface IPossibilityContainer {
    [i: string]: IPossibility;
}

/**
 * Description of what can a title may represent, and its size.
 */
export interface IPossibility {
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
    contents: IPossibilityContents;
}

/**
 * Possible contents of a possibility, primarily its position
 * within the possibility and what it may contain.
 */
export interface IPossibilityContents {
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
    children: IPossibilityChild[];

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
 * Anything that may be chosen from an Array based on its probability.
 */
export interface IPercentageOption {
    /**
     * How likely this option is to be chosen, out of 100.
     */
    percent: number;
}

/**
 * An option for an IPossibility that describes a recursion
 * to another possibility or a final object to be placed.
 */
export interface IPossibilityChild extends IPercentageOption {
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
    arguments?: IArgumentPossibility[] | any;

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
export interface IPossibilitySpacing {
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
export interface IPossibilitySpacingOption extends IPercentageOption {
    /**
     * The description of a range of possibilities for spacing.
     */
    value: IPossibilitySpacing;
}

/**
 * An option for arguments to add to a choice.
 */
export interface IArgumentPossibility extends IPercentageOption {
    /**
     * An Object containing values to add to a choice.
     */
    values: IArgumentMap;
}

/**
 * An Object containing values to add to a choice.
 */
export interface IArgumentMap {
    [i: string]: any;
    width?: any;
    height?: any;
}

/**
 * A mapping of directions to equivalent keys, such as opposites.
 */
export interface IDirectionsMap {
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
export interface IPosition {
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
export interface ICommand extends IPosition {
    /**
     * The identifier of the possibility.
     */
    title: string;

    /**
     * Arguments to pass to the output of the possibility.
     */
    arguments?: IArgumentMap;
}

/**
 * A final choice for a possibility's output.
 */
export interface IChoice extends ICommand {
    /**
     * What type of output this is, as "Known" or "Random".
     */
    type?: string;

    /**
     * The actual choice contents.
     */
    contents?: IChoice;

    /**
     * Potential children to place in the contents.
     */
    children?: IChoice[];
}

/**
 * A random number generator that returns a decimal within [0, 1).
 *
 * @returns A random decimal within [0, 1).
 */
export type IRandomNumberGenerator = () => number;

/**
 * A random number generator that returns a decimal within [min, max).
 *
 * @param min   Minimum return value.
 * @param max   Maximum return value.
 * @returns A random decimal within [min, max).
 */
export type IRandomNumberBetweenGenerator = (min: number, max: number) => number;

/**
 * A general description of possibilities for spacing, as a Number,
 * list of Numbers, possibility, or some combination thereof.
 */
export type Spacing = number | number[] | IPossibilitySpacing | IPossibilitySpacingOption[];

/**
 * Callback for runGeneratedCommands to place "known" children.
 *
 * @param commands   A set of generated commands to be placed.
 */
export type IOnPlacement = (commands: ICommand[]) => void;

/**
 * Settings to initialize a new IWorldSeedr.
 */
export interface IWorldSeedrSettings {
    /**
     * A listing of possibility schemas, keyed by title.
     */
    possibilities?: IPossibilityContainer;

    /**
     * Function used to generate a random number, if not Math.random.
     */
    random?: IRandomNumberGenerator;

    /**
     * Function called in this.generateFull to place a child.
     */
    onPlacement?: IOnPlacement;
}

/**
 * A randomization utility to automate random, recursive generation of
 * possibilities based on position and probability schemas.
 */
export interface IWorldSeedr {
    /**
     * @returns The listing of possibilities that may be generated.
     */
    getPossibilities(): IPossibilityContainer;

    /**
     * @param possibilitiesNew   A new Object to list possibilities
     *                           that may be generated.
     */
    setPossibilities(possibilities: IPossibilityContainer): void;

    /**
     * @returns Callback for runGeneratedCommands to place "known" children.
     */
    getOnPlacement(): (commands: ICommand[]) => void;

    /**
     * @param onPlacementNew   A new Function to be used as onPlacement.
     */
    setOnPlacement(onPlacement: (commands: ICommand[]) => void): void;

    /**
     * Resets the generatedCommands Array so runGeneratedCommands can start.
     */
    clearGeneratedCommands(): void;

    /**
     * Runs the onPlacement callback on the generatedCommands Array.
     */
    runGeneratedCommands(): void;

    /**
     * Generates a collection of randomly chosen possibilities based on the
     * given schema mapping. These does not recursively parse the output; do
     * do that, use generateFull.
     *
     * @param name   The name of the possibility schema to start from.
     * @param position   An Object that contains .left, .right, .top,
     *                   and .bottom.
     * @returns An Object containing a position within the given
     *          position and some number of children.
     */
    generate(name: string, command: IPosition | ICommand): IChoice | undefined;

    /**
     * Recursively generates a schema. The schema's title and itself are given
     * to this.generate; all outputs of type "Known" are added to the
     * generatedCommands Array, while everything else is recursed upon.
     *
     * @param schema   A simple Object with basic information on the
     *                 chosen possibility.
     * @returns An Object containing a position within the given
     *          position and some number of children.
     */
    generateFull(schema: ICommand): void;
}
