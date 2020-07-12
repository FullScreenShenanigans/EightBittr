import { FpsAnalyzr } from "fpsanalyzr";

import { EightBittr } from "../EightBittr";

export const createFpsAnalyzer = (game: EightBittr) =>
    new FpsAnalyzr(game.settings.components.fpsAnalyzer);
