interface IFPSAnalyzrSettings {
    maxKept?: number;
    getTimestamp?: any;
}

/**
 * FPSAnalyzr.js
 * 
 * A general utility for obtaining and analyzing framerate measurements. The 
 * most recent measurements are kept up to a certain point (either an infinite
 * number or a set amount). Options for analyzing the data such as getting the
 * mean, median, extremes, etc. are available.
 * 
 * @example
 * // Creating and using an FPSAnalyzr to measure setInterval accuracy.
 * var FPSAnalyzer = new FPSAnalyzr();
 * setInterval(FPSAnalyzer.measure.bind(FPSAnalyzer), 1000 / 30);
 * setTimeout(
 *     function () {
 *         console.log("Average FPS:", FPSAnalyzer.getAverage());
 *     },
 *     7000
 * );
 * 
 * @example
 * // Creating and using an FPSAnalyzr to look at the 10 most recent FPS
 * // measurements and get the best & worst amounts.
 * var target = 1000 / 30,
 *     numKept = 10,
 *     FPSAnalyzer = new FPSAnalyzr({
 *         "maxKept": numKept
 *     }),
 *     i;
 * 
 * for (i = 0; i < numKept; i += 1) {
 *     setTimeout(FPSAnalyzer.measure.bind(FPSAnalyzer), i * target);
 * }
 * 
 * setTimeout(
 *     function () {
 *         console.log("Measurements:", FPSAnalyzer.getMeasurements());
 *         console.log("Extremes:", FPSAnalyzer.getExtremes());
 *         console.log("Range:", FPSAnalyzer.getRange());
 *     },
 *     numKept * i * target
 * );
 * 
 * @author "Josh Goldberg" <josh@fullscreenmario.com>
 */
class FPSAnalyzr {
    // A system-dependant performance.now function
    public getTimestamp: any;

    // The number of FPS measurements to keep
    private maxKept: number;

    // A recent history of FPS measurements (normally an Array)
    // These are stored as changes in millisecond timestamps
    private measurements: any;

    // The actual number of FPS measurements currently known
    private numRecorded: number;

    // The current position in measurements
    private ticker: number;

    // The most recent performance.now timestamp
    private timeCurrent: number;

    /**
     * Resets the FPSAnalyzr.
     * 
     * @constructor
     * @param {Number} [maxKept]   The maximum number of FPS measurements to
     *                             keep. This defaults to 35, and can be a
     *                             Number or Infinity otherwise.
     * @param [Function} getTimestamp   A function used to get an accurate
     *                                  timestamp. By default this is 
     *                                  performance.now.
     */
    constructor(settings: IFPSAnalyzrSettings = {}) {
        this.maxKept = settings.maxKept || 35;
        this.numRecorded = 0;
        this.ticker = -1;

        // If maxKept is a Number, make the measurements array that long
        // If it's infinite, make measurements an {} (infinite array)
        this.measurements = isFinite(this.maxKept) ? new Array(this.maxKept) : {};

        // Headless browsers like PhantomJS won't know performance, so Date.now
        // is used as a backup
        if (typeof settings.getTimestamp === "undefined") {
            if (typeof performance === "undefined") {
                this.getTimestamp = function (): number {
                    return Date.now();
                };
            } else {
                this.getTimestamp = (
                    performance.now
                    || (<any>performance).webkitNow
                    || (<any>performance).mozNow
                    || (<any>performance).msNow
                    || (<any>performance).oNow
                    ).bind(performance);
            }
        } else {
            this.getTimestamp = settings.getTimestamp;
        }
    }


    /* Public interface
    */

    /**
     * Standard public measurement function.
     * Marks the current timestamp as timeCurrent, and adds an FPS measurement
     * if there was a previous timeCurrent.
     * 
     * @param {DOMHighResTimeStamp} time   An optional timestamp, without which
     *                                     getTimestamp() is used instead.
     */
    measure(time: number = this.getTimestamp()): void {
        if (this.timeCurrent) {
            this.addFPS(1000 / (time - this.timeCurrent));
        }

        this.timeCurrent = time;
    }

    /**
     * Adds an FPS measurement to measurements, and increments the associated
     * count variables.
     * 
     * @param {Number} fps   An FPS calculated as the difference between two
     *                       timestamps.
     */
    addFPS(fps: number): void {
        this.ticker = (this.ticker += 1) % this.maxKept;
        this.measurements[this.ticker] = fps;
        this.numRecorded += 1;
    }


    /* Gets
    */

    /**
     * @return {Number} The number of FPS measurements to keep.
     */
    getMaxKept(): number {
        return this.maxKept;
    }

    /**
     * @return {Number} The actual number of FPS measurements currently known.
     */
    getNumRecorded(): number {
        return this.numRecorded;
    }

    /**
     * @return {Number} The most recent performance.now timestamp.
     */
    getTimeCurrent(): number {
        return this.timeCurrent;
    }

    /**
     * @return {Number} The current position in measurements.
     */
    getTicker(): number {
        return this.ticker;
    }

    /**
     * Get function for a copy of the measurements listing (if the number of
     * measurements is less than the max, that size is used)
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    measurements
     */
    getMeasurements(): any {
        var fpsKeptReal: number = Math.min(this.maxKept, this.numRecorded),
            copy: any,
            i: number;

        if (isFinite(this.maxKept)) {
            copy = new Array(fpsKeptReal);
        } else {
            copy = {};
            copy.length = fpsKeptReal;
        }

        for (i = fpsKeptReal - 1; i >= 0; --i) {
            copy[i] = this.measurements[i];
        }

        return copy;
    }

    /**
     * Get function for a copy of the measurements listing, but with the FPS
     * measurements transformed back into time differences
     * 
     * @return {Object}   An object (normally an Array) of the most recent FPS
     *                    time differences
     */
    getDifferences(): any {
        var copy: any = this.getMeasurements(),
            i: number;

        for (i = copy.length - 1; i >= 0; --i) {
            copy[i] = 1000 / copy[i];
        }

        return copy;
    }

    /**
     * @return {Number} The average recorded FPS measurement.
     */
    getAverage(): number {
        var total: number = 0,
            max: number = Math.min(this.maxKept, this.numRecorded),
            i: number;

        for (i = max - 1; i >= 0; --i) {
            total += this.measurements[i];
        }

        return total / max;
    }

    /**
     * @remarks This is O(n*log(n)), where n is the size of the history,
     *          as it creates a copy of the history and sorts it.
     * @return {Number} The median recorded FPS measurement.
     */
    getMedian(): number {
        var copy: any = this.getMeasurements().sort(),
            fpsKeptReal: number = copy.length,
            fpsKeptHalf: number = Math.floor(fpsKeptReal / 2);

        if (copy.length % 2 === 0) {
            return copy[fpsKeptHalf];
        } else {
            return (copy[fpsKeptHalf - 2] + copy[fpsKeptHalf]) / 2;
        }
    }

    /**
     * @return {Number[]} An Array containing the lowest and highest recorded
     *                    FPS measurements, in that order.
     */
    getExtremes(): number[] {
        var lowest: number = this.measurements[0],
            highest: number = lowest,
            max: number = Math.min(this.maxKept, this.numRecorded),
            fps: number,
            i: number;

        for (i = max - 1; i >= 0; --i) {
            fps = this.measurements[i];
            if (fps > highest) {
                highest = fps;
            } else if (fps < lowest) {
                lowest = fps;
            }
        }

        return [lowest, highest];
    }

    /**
     * @return {Number} The range of recorded FPS measurements
     */
    getRange(): number {
        var extremes: number[] = this.getExtremes();
        return extremes[1] - extremes[0];
    }
}
