/**
 * Settings to initialize a new NumberMakr.
 */
export interface NumberMakrSettings {
    /**
     * A starting seed used to initialize. This can be a Number or Array; the
     * appropriate resetFrom Function will be called.
     */
    seed?: number | number[];

    /**
     * How long the state vector should be.
     */
    stateLength?: number;

    /**
     * How long the state period should be.
     */
    statePeriod?: number;

    /**
     * A constant mask to generate the matrixAMagic Array of [0, some number].
     */
    matrixA?: number;

    /**
     * An upper mask to binary-and on (the most significant w-r bits).
     */
    maskUpper?: number;

    /**
     * A lower mask to binary-and on (the least significant r bits).
     */
    maskLower?: number;
}
