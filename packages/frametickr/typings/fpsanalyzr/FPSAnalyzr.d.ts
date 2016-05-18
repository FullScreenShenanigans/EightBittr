declare module "IFPSAnalyzr" {
    export interface ITimestampGetter {
        (): number;
    }
    export interface IFPSAnalyzrSettings {
        maxKept?: number;
        getTimestamp?: any;
    }
    export interface IFPSAnalyzr {
        getTimestamp: ITimestampGetter;
        measure(time?: number): void;
        addFPS(fps: number): void;
        getMaxKept(): number;
        getNumRecorded(): number;
        getTimeCurrent(): number;
        getTicker(): number;
        getMeasurements(getAll: boolean): number[];
        getDifferences(): number[];
        getAverage(): number;
        getMedian(): number;
        getExtremes(): number[];
        getRange(): number;
    }
}
declare module "FPSAnalyzr" {
    import { IFPSAnalyzr, IFPSAnalyzrSettings, ITimestampGetter } from "IFPSAnalyzr";
    export class FPSAnalyzr implements IFPSAnalyzr {
        getTimestamp: ITimestampGetter;
        private maxKept;
        private measurements;
        private numRecorded;
        private ticker;
        private timeCurrent;
        constructor(settings?: IFPSAnalyzrSettings);
        measure(time?: number): void;
        addFPS(fps: number): void;
        getMaxKept(): number;
        getNumRecorded(): number;
        getTimeCurrent(): number;
        getTicker(): number;
        getMeasurements(getAll?: boolean): number[];
        getDifferences(): number[];
        getAverage(): number;
        getMedian(): number;
        getExtremes(): number[];
        getRange(): number;
        private getMeasurementsSorted();
    }
}
