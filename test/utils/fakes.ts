import { GameStartr } from "../../src/GameStartr";
import { IGameStartrSettings } from "../../src/IGameStartr";

export function stubGameStartr(settings?: IGameStartrSettings): GameStartr {
    return new GameStartr({
        width: 256,
        height: 256,
        ...settings
    });
}
