import * as lolex from "lolex";

import { GamesRunnr } from "./GamesRunnr";
import { IGamesRunnrSettings, ITickCanceller, ITickScheduler } from "./IGamesRunnr";

export const stubGamesRunnr = (settings: Partial<IGamesRunnrSettings> = {}) => {
    const clock = lolex.createClock();

    const gamesRunner = new GamesRunnr({
        tickCanceller: clock.clearTimeout as ITickCanceller,
        tickScheduler: clock.setTimeout as ITickScheduler,
        ...settings,
    });

    return { clock, gamesRunner };
};
