import { FrameTickr } from "frametickr";

import { EightBittr } from "../EightBittr";

export const createFrameTicker = (game: EightBittr) =>
    new FrameTickr({
        events: {
            pause: game.gameplay.onPause.bind(game.gameplay),
            play: game.gameplay.onPlay.bind(game.gameplay),
        },
        frame: (adjustedTimestamp) => {
            game.fpsAnalyzer.tick(adjustedTimestamp);
            game.frames.advance();
            game.frames.move();
            game.frames.setQuadrants();
            game.frames.runCollisions();
            game.frames.updateCanvas();
        },
        interval: game.frames.interval,
        ...game.settings.components.frameTicker,
    });
