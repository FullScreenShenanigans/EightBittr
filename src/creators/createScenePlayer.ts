import { ScenePlayr } from "sceneplayr";

import { EightBittr } from "../EightBittr";

export const createScenePlayer = (eightBitter: EightBittr) =>
    new ScenePlayr(eightBitter.settings.components.scenePlayer);
