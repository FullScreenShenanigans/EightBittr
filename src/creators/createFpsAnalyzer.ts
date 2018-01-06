import { FpsAnalyzr } from "fpsanalyzr";

import { GameStartr } from "../GameStartr";

export const createFpsAnalyzer = (gameStarter: GameStartr) =>
    new FpsAnalyzr(gameStarter.settings.components.frames);
