/**
 * functions to compute new variable values, keyed by their variable's names.
 */
export interface IVariableFunctions {
    [i: string]: () => any;
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
     * Assorted known variables, keyed by name.
     */
    variables?: IVariables;
}
