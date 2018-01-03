import { IGamesRunnr, IGamesRunnrSettings } from "./IGamesRunnr";

/**
 * Runs a series of callbacks on a timed interval.
 */
export class GamesRunnr implements IGamesRunnr {
    /**
     * Settings used for initialization.
     */
    private readonly settings: IGamesRunnrSettings;

    /**
     * Reference to the next tick, such as setTimeout's returned int.
     */
    private nextTick: {};

    /**
     * Whether the game is currently paused.
     */
    private paused: boolean;

    /**
     * Initializes a new instance of the GamesRunnr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: Partial<IGamesRunnrSettings>) {
        this.settings = {
            events: {},
            games: [],
            interval: 1000 / 60,
            tickScheduler: setTimeout.bind(window),
            tickCanceller: clearTimeout.bind(window),
            ...settings,
        };

        this.paused = true;
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
        this.settings.tickCanceller(this.nextTick);

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
        this.runGames();

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
     * Runs all games.
     */
    private runGames = (): void => {
        if (this.paused) {
            return;
        }

        this.nextTick = this.settings.tickScheduler(this.runGames, this.settings.interval);

        for (const game of this.settings.games) {
            game();
        }
    }
}
