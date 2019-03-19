import { IGamesRunnr, IGamesRunnrSettings } from "./IGamesRunnr";
import { createGameTiming } from "./timing";

/**
 * Runs a series of callbacks on a timed interval.
 */
export class GamesRunnr implements IGamesRunnr {
    /**
     * Settings used for initialization.
     */
    private readonly settings: IGamesRunnrSettings;

    /**
     * Reference to the next tick from `requestFrame`.
     */
    private nextTickHandle: unknown;

    /**
     * Whether the game is currently paused.
     */
    private paused: boolean;

    /**
     * The most recent timestamp this was run at, if ever.
     */
    private previousTimestamp?: number;

    /**
     * Initializes a new instance of the GamesRunnr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(rawSettings: Partial<IGamesRunnrSettings>) {
        const timing = rawSettings.timing === undefined
            ? createGameTiming()
            : rawSettings.timing;

        this.settings = {
            events: {},
            games: [],
            interval: 1000 / 60,
            ...rawSettings,
            timing,
        };

        this.paused = true;
    }

    /**
     * Gets the time interval between game executions.
     *
     * @returns Time interval between game executions in milliseconds.
     */
    public getInterval(): number {
        return this.settings.interval;
    }

    /**
     * Gets whether this is paused.
     *
     * @returns Whether this is paused.
     */
    public getPaused(): boolean {
        return this.paused;
    }

    /**
     * Stops execution of games.
     */
    public pause(): void {
        if (this.paused) {
            return;
        }

        this.paused = true;
        this.previousTimestamp = undefined;
        this.settings.timing.cancelFrame(this.nextTickHandle);

        if (this.settings.events.pause) {
            this.settings.events.pause();
        }
    }

    /**
     * Starts execution of games.
     */
    public play(): void {
        if (!this.paused) {
            return;
        }

        this.paused = false;
        this.attemptTick(this.settings.timing.getTimestamp());

        if (this.settings.events.play) {
            this.settings.events.play();
        }
    }

    /**
     * Sets the interval between games.
     *
     * @param interval   New time interval in milliseconds.
     */
    public setInterval(interval: number): void {
        if (isNaN(interval)) {
            throw new Error(`Invalid interval given to setInterval: '${interval}'.`);
        }

        this.settings.interval = interval;
    }

    /**
     * Runs the next frame if enough time has elapsed since the previous run.
     *
     * @param timestamp   Current timestamp to compare the previous timestamp against.
     */
    private readonly attemptTick = (timestamp: DOMHighResTimeStamp): void => {
        if (this.paused) {
            return;
        }

        this.nextTickHandle = this.settings.timing.requestFrame(this.attemptTick);

        if (this.previousTimestamp === undefined) {
            this.runFrame(timestamp);
            return;
        }

        const timestampDelta = timestamp - this.previousTimestamp;
        if (timestampDelta < this.settings.interval) {
            return;
        }

        this.runFrame(timestamp - (timestampDelta - this.settings.interval));
    }

    /**
     * Runs a frame and stores the new timestamp.
     *
     * @param adjustedTimestamp   Delay-adjusted current timestamp to store.
     */
    private runFrame(adjustedTimestamp: number) {
        this.previousTimestamp = adjustedTimestamp;

        for (const game of this.settings.games) {
            game();
        }
    }
}
