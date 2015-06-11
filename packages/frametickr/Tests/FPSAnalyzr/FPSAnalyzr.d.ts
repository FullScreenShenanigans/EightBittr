declare module FPSAnalyzr {
    export interface IFPSAnalyzrSettings {
        maxKept?: number;
        getTimestamp?: any;
    }

    export interface IFPSAnalyzr {
        getTimestamp: () => number;
        measure(time?: number): void;
        addFPS(fps: number): void;
        getMaxKept(): number;
        getNumRecorded(): number;
        getTimeCurrent(): number;
        getTicker(): number;
        getMeasurements(): any;
        getDifferences(): any;
        getAverage(): number;
        getMedian(): number;
        getExtremes(): number[];
        getRange(): number;
    }
}
