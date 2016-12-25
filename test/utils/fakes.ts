import { GameStartr } from "../../src/GameStartr";
import { Graphics } from "../../src/components/Graphics";
import { Gameplay } from "../../src/components/Gameplay";
import { IGameStartrSettings, IModuleSettings } from "../../src/components/IGameStartr";
import { Maps } from "../../src/components/Maps";
import { Physics } from "../../src/components/Physics";
import { Scrolling } from "../../src/components/Scrolling";
import { Things } from "../../src/components/Things";
import { Utilities } from "../../src/components/Utilities";

export function stubGameStartr(): GameStartr {
    return new StubGameStartr({
        width: 256,
        height: 256
    });
}
