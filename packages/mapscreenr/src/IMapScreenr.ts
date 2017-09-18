/**
 * Functions to compute new variable values, keyed by their variable's names.
 */
export interface IVariableFunctions {
    [i: string]: Function;
}

/**
 * Known variables, keyed by name.
 */
export interface IVariables {
    [i: string]: any;
}

/**
 * Settings to initialize a new instance of the MapScreenr class.
 */
export interface IMapScreenrSettings {
    /**
     * How wide the MapScreenr should be.
     */
    width: number;

    /**
     * How tall the MapScreenr should be.
     */
    height: number;

    /**
     * A mapping of functions to generate member variables that should be
     * recomputed on screen change, keyed by variable name.
     */
    variableFunctions?: IVariableFunctions;

    /**
     * Arguments to be passed to variable Functions.
     */
    variableArgs?: any[];

    /**
     * Assorted known variables, keyed by name.
     */
    variables?: IVariables;
}

/**
 * A flexible container for map attributes and viewport.
 */
export interface IMapScreenr {
    /**
     * Top border measurement of the bounding box.
     */
    top: number;

    /**
     * Right border measurement of the bounding box.
     */
    right: number;

    /**
     * Bottom border measurement of the bounding box.
     */
    bottom: number;

    /**
     * Left border measurement of the bounding box.
     */
    left: number;

    /**
     * Constant horizontal midpoint of the bounding box, equal to (left + right) / 2.
     */
    middleX: number;

    /**
     * Constant vertical midpoint of the bounding box, equal to (top + bottom) / 2.
     */
    middleY: number;

    /**
     * Constant width of the bounding box.
     */
    width: number;

    /**
     * Constant height of the bounding box.
     */
    height: number;

    /**
     * A listing of variable Functions to be calculated on screen resets.
     */
    variableFunctions: IVariableFunctions;

    /**
     * Arguments to be passed into variable computation Functions.
     */
    variableArgs: any[];

    /**
     * Known variables, keyed by name.
     */
    variables: IVariables;

    /**
     * Completely clears the MapScreenr for use in a new Area. Positioning is
     * reset to (0,0) and user-configured variables are recalculated.
     */
    clearScreen(): void;

    /**
     * Computes middleX as the midpoint between left and right.
     */
    setMiddleX(): void;

    /**
     * Computes middleY as the midpoint between top and bottom.
     */
    setMiddleY(): void;

    /**
     * Recalculates all variables by passing variableArgs to their Functions.
     */
    setVariables(): void;

    /**
     * Recalculates a variable by passing variableArgs to its Function.
     *
     * @param name   The name of the variable to recalculate.
     * @param value   A new value for the variable instead of its Function's result.
     * @returns The new value of the variable.
     */
    setVariable(name: string, value?: any): any;

    /**
     * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
     *
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    shift(dx: number, dy: number): void;

    /**
     * Shifts the MapScreenr horizontally by changing left and right by the dx.
     *
     * @param dx   How far to scroll horizontally.
     */
    shiftX(dx: number): void;

    /**
     * Shifts the MapScreenr vertically by changing top and bottom by the dy.
     *
     * @param dy   How far to scroll vertically.
     */
    shiftY(dy: number): void;
}
