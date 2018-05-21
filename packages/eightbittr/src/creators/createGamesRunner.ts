import { GamesRunnr } from "gamesrunnr";

import { EightBittr } from "../EightBittr";

export const createGamesRunner = (eightBitter: EightBittr) =>
    new GamesRunnr({
        events: {
            pause: (): void => {
                eightBitter.gameplay.onPause();
            },
            play: (): void => {
                eightBitter.gameplay.onPlay();
            },
        },
        ...eightBitter.settings.components.gamesRunner,
    });
