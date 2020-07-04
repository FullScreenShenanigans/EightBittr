import { ScenePlayr } from "sceneplayr";

import { EightBittr } from "../EightBittr";

export const createScenePlayer = (game: EightBittr) =>
    new ScenePlayr(game.settings.components.scenePlayer);
