declare module "INumberMakr" {
    export interface INumberMakrSettings {
        seed?: number | number[];
        stateLength?: number;
        statePeriod?: number;
        matrixA?: number;
        maskUpper?: number;
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
declare module "NumberMakr" {
    import { INumberMakr, INumberMakrSettings } from "INumberMakr";
    export class NumberMakr implements INumberMakr {
        private stateLength;
        private statePeriod;
        private matrixA;
        private matrixAMagic;
        private maskUpper;
        private maskLower;
        private stateVector;
        private stateIndex;
        private seed;
        constructor(settings?: INumberMakrSettings);
        getSeed(): number | number[];
        getStateLength(): number;
        getStatePeriod(): number;
        getMatrixA(): number;
        getMaskUpper(): number;
        getMaskLower(): number;
        resetFromSeed(seedNew: number | number[]): void;
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
        randomArrayMember<T>(array: T[]): T;
    }
}
