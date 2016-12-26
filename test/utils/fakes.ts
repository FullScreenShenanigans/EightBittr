import { GameStartr } from "../../src/GameStartr";
import { ISizeSettings } from "../../src/IGameStartr";

export function stubGameStartr(settings?: ISizeSettings): GameStartr {
    return new GameStartr({
        width: 256,
        height: 256,
        ...settings
    });
}
