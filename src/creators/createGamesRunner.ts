import { GamesRunnr } from "gamesrunnr";

import { GameStartr } from "../GameStartr";

export const createGamesRunner = (gameStarter: GameStartr) =>
    new GamesRunnr({
        events: {
            pause: (): void => {
                gameStarter.gameplay.onPause();
            },
            play: (): void => {
                gameStarter.gameplay.onPlay();
            },
        },
        ...gameStarter.settings.components.runner,
    });
