import { FrameTickr } from "frametickr";

import { EightBittr } from "../EightBittr";

export const createFrameTicker = (game: EightBittr) =>
    new FrameTickr({
        events: game.frames.events,
        frame: (adjustedTimestamp) => {
            game.fpsAnalyzer.tick(adjustedTimestamp);
            game.frames.advance();
            game.frames.maintain();
            game.frames.setQuadrants();
            game.frames.runCollisions();
            game.frames.updateCanvas();
        },
        interval: game.frames.interval,
        ...game.settings.components.frameTicker,
    });
