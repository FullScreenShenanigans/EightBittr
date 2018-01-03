import { FpsAnalyzr } from "./FpsAnalyzr";
import { IFpsAnalyzrSettings } from "./index";

export const stubFpsAnalyzr = (settings: Partial<IFpsAnalyzrSettings> = {}) => {
    let nextTimestamp = 0;

    const fpsAnalyzer = new FpsAnalyzr({
        getTimestamp: (): number => nextTimestamp,
        ...settings,
    });

    const tick = (time: number): void => {
        nextTimestamp = time;
        fpsAnalyzer.tick();
    };

    return { fpsAnalyzer, tick };
};
