import { IExtremes, IFpsAnalyzr, IFpsAnalyzrSettings } from "./IFpsAnalyzr";

/**
 * Default maximum number of FPS measurements to keep.
 */
export const defaultMaximumKept = 250;

/**
 * Storage and analysis for framerate measurements.
 */
export class FpsAnalyzr implements IFpsAnalyzr {
    /**
     * How many FPS measurements to keep at any given time, at most.
     */
    private readonly maximumKept: number;

    /**
     * History of FPS measurements.
     */
    private readonly measurements: number[];

    /**
     * How many timestamp deltas have been measured.
     */
    private recordedMeasurements: number;

    /**
     * How many ticks have been received.
     */
    private recordedTicks: number;

    /**
     * The current position in the internal measurements listing.
     */
    private ticker: number;

    /**
     * The most recent timestamp received.
     */
    private timeCurrent: number;

    /**
     * Initializes a new instance of the FPSAnalyzr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IFpsAnalyzrSettings = {}) {
        this.maximumKept =
            settings.maximumKept === undefined ? defaultMaximumKept : settings.maximumKept;
        this.recordedMeasurements = 0;
        this.recordedTicks = 0;
        this.ticker = 0;
        this.measurements = [];
    }

    /**
     * Records a frame tick.
     *
     * @param time   Current timestamp.
     */
    public tick = (time: number): void => {
        if (this.timeCurrent !== undefined) {
            this.measurements[this.ticker] = 1000 / (time - this.timeCurrent);
            this.recordedMeasurements += 1;
            this.ticker = (this.ticker += 1) % this.maximumKept;
        }

        this.timeCurrent = time;
        this.recordedTicks += 1;
    };

    /**
     * Gets the average computed FPS.
     *
     * @returns Average computed FPS.
     */
    public getAverage(): number {
        if (this.measurements.length === 0) {
            return 0;
        }

        const realRecordedLength: number = Math.min(this.maximumKept, this.recordedMeasurements);
        let total = 0;

        for (let i = 0; i < realRecordedLength; i += 1) {
            total += this.measurements[i];
        }

        return total / realRecordedLength;
    }

    /**
     * Gets the highest and lowest computed FPS.
     *
     * @returns Highest and lowest computed FPS.
     */
    public getExtremes(): IExtremes {
        if (this.measurements.length === 0) {
            return {
                highest: 0,
                lowest: 0,
            };
        }

        const realRecordedLength: number = Math.min(this.maximumKept, this.recordedMeasurements);
        let lowest: number = this.measurements[0];
        let highest: number = lowest;

        for (let i = 1; i < realRecordedLength; i += 1) {
            const fps: number = this.measurements[i];

            if (fps > highest) {
                highest = fps;
            } else if (fps < lowest) {
                lowest = fps;
            }
        }

        return { highest, lowest };
    }

    /**
     * Gets the median computed FPS.
     *
     * @returns Median computed FPS.
     */
    public getMedian(): number {
        if (this.measurements.length === 0) {
            return 0;
        }

        const realRecordedLength: number = Math.min(this.maximumKept, this.recordedMeasurements);
        const copy: number[] = this.measurements.slice(0, realRecordedLength).sort();
        const fpsKeptHalf: number = Math.floor(realRecordedLength / 2);

        return copy.length % 2 === 0
            ? (copy[fpsKeptHalf - 1] + copy[fpsKeptHalf]) / 2
            : copy[fpsKeptHalf];
    }

    /**
     * Gets how many ticks have been recorded in total.
     *
     * @returns Total number of recorded ticks.
     */
    public getRecordedTicks(): number {
        return this.recordedTicks;
    }
}
