import { FpsAnalyzr } from "fpsanalyzr";

import { GameStartr } from "../gamestartr";

export const createFpsAnalyzer = (gameStarter: GameStartr) =>
    new FpsAnalyzr(gameStarter.settings.components.frames);
