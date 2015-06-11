declare module NumberMakr {
    export interface INumberMakrSettings {
        // A starting seed used to initialize. This can be a Number or Array; the
        // appropriate resetFrom Function will be called.
        seed?: number | number[];

        // How long the state vector will be.
        stateLength?: number;

        // How long the state period will be.
        statePeriod?: number;

        // A constant mask to generate the matrixAMagic Array of [0, some number].
        matrixA?: number;

        // An upper mask to binary-and on (the most significant w-r bits).
        maskUpper?: number;

        // A lower mask to binary-and on (the least significant r bits).
        maskLower?: number;
    }

    export interface INumberMakr {
        getSeed(): number | number[];
        getStateLength(): number;
        getStatePeriod(): number;
        getMatrixA(): number;
        getMaskUpper(): number;
        getMaskLower(): number;
        resetFromSeed(seedNew?: number | number[]): void;
        resetFromArray(keyInitial: number[], keyLength?: number): void;
        randomInt32(): number;
        random(): number;
        randomInt31(): number;
        randomReal1(): number;
        randomReal3(): number;
        randomReal53Bit(): number;
        randomUnder(max: number): number;
        randomWithin(min: number, max: number): number;
        randomInt(max: number): number;
        randomIntWithin(min: number, max: number): number;
        randomBoolean(): boolean;
        randomBooleanProbability(probability: number): boolean;
        randomBooleanFraction(numerator: number, denominator: number): boolean;
        randomArrayIndex(array: any[]): number;
        randomArrayMember(array: any[]): any;
    }
}