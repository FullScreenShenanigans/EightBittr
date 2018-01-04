import { ScenePlayr } from "sceneplayr";

import { GameStartr } from "../gamestartr";

export const createScenePlayer = (gameStarter: GameStartr) =>
    new ScenePlayr(gameStarter.settings.components.scenes);
