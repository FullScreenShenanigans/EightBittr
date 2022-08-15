import { MenuGraphr } from "menugraphr";

import { FullScreenSaver } from "../FullScreenSaver";

export const createMenuGrapher = (game: FullScreenSaver): MenuGraphr =>
    new MenuGraphr({
        game,
        schemas: {
            Score: {
                height: 48,
                position: {
                    vertical: "bottom",
                },
                textPaddingX: 8,
                textPaddingY: 24,
                width: game.mapScreener.width / 2,
            },
        },
    });
