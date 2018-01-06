import { ScenePlayr } from "sceneplayr";

import { GameStartr } from "../GameStartr";

export const createScenePlayer = (gameStarter: GameStartr) =>
    new ScenePlayr(gameStarter.settings.components.scenes);
