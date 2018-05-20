import { FpsAnalyzr } from "fpsanalyzr";

import { EightBittr } from "../EightBittr";

export const createFpsAnalyzer = (eightBitter: EightBittr) =>
    new FpsAnalyzr(eightBitter.settings.components.frames);
