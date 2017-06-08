import { GamesRunnr } from "../../src/GamesRunnr";
import { IGamesRunnr, IGamesRunnrSettings } from "../../src/IGamesRunnr";

/**
 *
 */
export function mockGamesRunnr(settings: IGamesRunnrSettings): IGamesRunnr {
    return new GamesRunnr(settings);
}
