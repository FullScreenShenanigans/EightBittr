import { GamesRunnr } from "gamesrunnr";

import { GameStartr } from "../gamestartr";

export const createGamesRunner = (gameStarter: GameStartr) =>
    new GamesRunnr({
        events: {
            play: (): void => {
                gameStarter.gameplay.onPlay();
            },
            pause: (): void => {
                gameStarter.gameplay.onPause();
            },
        },
        ...gameStarter.settings.components.runner,
    });
