import { FpsAnalyzr } from "./FpsAnalyzr";
import { FpsAnalyzrSettings } from "./index";

export const stubFpsAnalyzr = (settings: Partial<FpsAnalyzrSettings> = {}) => {
    const fpsAnalyzer = new FpsAnalyzr(settings);

    return { fpsAnalyzer };
};
