import { IScenePlayr, IScenePlayrSettings } from "../../src/IScenePlayr";
import { ScenePlayr } from "../../src/ScenePlayr";

/**
 *
 */
export function mockScenePlayr(settings?: IScenePlayrSettings): IScenePlayr {
    return new ScenePlayr(settings);
}
