import { FpsAnalyzr } from "./FpsAnalyzr";
import { IFpsAnalyzrSettings } from "./index";

export const stubFpsAnalyzr = (settings: Partial<IFpsAnalyzrSettings> = {}) => {
    const fpsAnalyzer = new FpsAnalyzr(settings);

    return { fpsAnalyzer };
};
