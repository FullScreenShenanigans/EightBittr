import * as lolex from "lolex";

import { GamesRunnr } from "./GamesRunnr";
import { IGamesRunnrSettings } from "./IGamesRunnr";

export const stubGamesRunnr = (settings: Partial<IGamesRunnrSettings> = {}) => {
    const clock = lolex.createClock();

    const gamesRunner = new GamesRunnr({
        timing: {
            cancelFrame: clock.clearTimeout,
            getTimestamp: () => clock.now,
            requestFrame: (callback) =>
                clock.setTimeout(
                    () => {
                        callback(clock.now);
                    },
                    1),
        },
        ...settings,
    });

    return { clock, gamesRunner };
};
