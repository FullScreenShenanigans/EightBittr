import * as lolex from "lolex";

import { GamesRunnr } from "./GamesRunnr";
import { IGamesRunnrSettings } from "./IGamesRunnr";

export const stubGamesRunnr = (settings: Partial<IGamesRunnrSettings> = {}) => {
    const clock = lolex.createClock();

    const gamesRunner = new GamesRunnr({
        tickCanceller: clock.clearTimeout,
        tickScheduler: clock.setTimeout,
        ...settings,
    });

    return { clock, gamesRunner };
};
