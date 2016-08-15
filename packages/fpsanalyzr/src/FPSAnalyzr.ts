import { IFPSAnalyzr, IFPSAnalyzrSettings, ITimestampGetter } from "./IFPSAnalyzr";

/**
 * Storage and analysis for framerate measurements.
 */
export class FPSAnalyzr implements IFPSAnalyzr {
    /**
     * Function to generate a current timestamp, commonly performance.now.
     */
    public getTimestamp: ITimestampGetter;

    /**
     * How many FPS measurements to keep at any given time, at most.
     */
    private maxKept: number;

    /**
     * A recent history of FPS measurements (normally an Array). These are
     * stored as changes in millisecond timestamps.
     */
    private measurements: number[];

    /**
     * The actual number of FPS measurements currently known.
     */
    private numRecorded: number;

    /**
     * The current position in the internal measurements listing.
     */
    private ticker: number;

    /**
     * The most recent timestamp from getTimestamp.
     */
    private timeCurrent: number;

    /**
     * Initializes a new instance of the FPSAnalyzr class.
     * 
     * @param [settings]
     */
    constructor(settings: IFPSAnalyzrSettings = {}) {
        this.maxKept = settings.maxKept || 35;
        this.numRecorded = 0;
        this.ticker = -1;
        this.measurements = [];

        // Headless browsers like PhantomJS won't know performance, so Date.now
        // is used as a backup
        if (typeof settings.getTimestamp === "undefined") {
            if (typeof performance === "undefined") {
                this.getTimestamp = (): number => Date.now();
            } else {
                this.getTimestamp = (
                    performance.now
                    || (performance as any).webkitNow
                    || (performance as any).mozNow
                    || (performance as any).msNow
                    || (performance as any).oNow
                ).bind(performance);
            }
        } else {
            this.getTimestamp = settings.getTimestamp;
        }
    }

    /**
     * Standard public measurement function.
     * Marks the current timestamp as timeCurrent, and adds an FPS measurement
     * if there was a previous timeCurrent.
     * 
     * @param [time]   An optional timestamp (by default, getTimestamp() is used).
     */
    public measure(time: number = this.getTimestamp()): void {
        if (this.timeCurrent) {
            this.addFPS(1000 / (time - this.timeCurrent));
        }

        this.timeCurrent = time;
    }

    /**
     * Adds an FPS measurement to measurements, and increments the associated
     * count variables.
     * 
     * @param fps   An FPS calculated as the difference between two timestamps.
     */
    public addFPS(fps: number): void {
        this.ticker = (this.ticker += 1) % this.maxKept;
        this.measurements[this.ticker] = fps;
        this.numRecorded += 1;
    }

    /**
     * @returns The number of FPS measurements to keep.
     */
    public getMaxKept(): number {
        return this.maxKept;
    }

    /**
     * @returns The actual number of FPS measurements currently known.
     */
    public getNumRecorded(): number {
        return this.numRecorded;
    }

    /**
     * @returns The most recent performance.now timestamp.
     */
    public getTimeCurrent(): number {
        return this.timeCurrent;
    }

    /**
     * @returns The current position in measurements.
     */
    public getTicker(): number {
        return this.ticker;
    }

    /**
     * @param getAll   Whether all measurements should be returned, rather than
     *                 the most recent (by default, false).
     * @returns The stored FPS measurements.
     */
    public getMeasurements(getAll?: boolean): number[] {
        return getAll
            ? this.measurements
            : this.measurements.slice(0, Math.min(this.maxKept, this.numRecorded));
    }

    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     * 
     * @returns A container of the most recent FPS time differences.
     */
    public getDifferences(): number[] {
        const copy: number[] = this.getMeasurements();

        for (let i: number = 0; i < copy.length; i += 1) {
            copy[i] = 1000 / copy[i];
        }

        return copy;
    }

    /**
     * @returns The average recorded FPS measurement.
     */
    public getAverage(): number {
        const max: number = Math.min(this.maxKept, this.numRecorded);
        let total: number = 0;

        for (let i: number = 0; i < max; i += 1) {
            total += this.measurements[i];
        }

        return total / max;
    }

    /**
     * @returns The median recorded FPS measurement.
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     */
    public getMedian(): number {
        const copy: number[] = this.getMeasurementsSorted();
        const fpsKeptReal: number = copy.length;
        const fpsKeptHalf: number = Math.floor(fpsKeptReal / 2);

        if (copy.length % 2 === 0) {
            return copy[fpsKeptHalf];
        } else {
            return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
        }
    }

    /**
     * @returns Array containing the lowest and highest recorded FPS 
     *          measurements, in that order.
     */
    public getExtremes(): number[] {
        const max: number = Math.min(this.maxKept, this.numRecorded);
        let lowest: number = this.measurements[0];
        let highest: number = lowest;

        for (let i: number = 0; i < max; i += 1) {
            const fps: number = this.measurements[i];

            if (fps > highest) {
                highest = fps;
            } else if (fps < lowest) {
                lowest = fps;
            }
        }

        return [lowest, highest];
    }

    /**
     * @returns The range of recorded FPS measurements.
     */
    public getRange(): number {
        const extremes: number[] = this.getExtremes();
        return extremes[1] - extremes[0];
    }

    /**
     * Converts all measurements to a Number[] in sorted order, regardless
     * of whether they're initially stored in an Array or Object.
     * 
     * @returns All measurements, sorted.
     */
    private getMeasurementsSorted(): number[] {
        const copy: number[] = this.measurements.slice().sort();

        if (this.numRecorded < this.maxKept) {
            copy.length = this.numRecorded;
        }

        return copy.sort();
    }
}
