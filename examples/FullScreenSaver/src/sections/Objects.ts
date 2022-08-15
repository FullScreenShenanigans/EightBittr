import { Objects as ObjectsBase } from "eightbittr";
import { ClassInheritance, ClassProperties } from "objectmakr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Raw ObjectMakr factory settings.
 */
export class Objects<Game extends FullScreenSaver> extends ObjectsBase<Game> {
    public readonly inheritance: ClassInheritance = {
        Actor: {
            Player: {},
            Square: {},
            Text: {
                Char0: {},
                Char1: {},
                Char2: {},
                Char3: {},
                Char4: {},
                Char5: {},
                Char6: {},
                Char7: {},
                Char8: {},
                Char9: {},
                CharA: {},
                CharB: {},
                CharC: {},
                CharD: {},
                CharE: {},
                CharF: {},
                CharG: {},
                CharH: {},
                CharI: {},
                CharJ: {},
                CharK: {},
                CharL: {},
                CharM: {},
                CharN: {},
                CharO: {},
                CharP: {},
                CharQ: {},
                CharR: {},
                CharS: {},
                CharT: {},
                CharU: {},
                CharV: {},
                CharW: {},
                CharX: {},
                CharY: {},
                CharZ: {},
                Menu: {},
            },
        },
    };

    public readonly onMake = "onMake";

    public readonly properties: ClassProperties = {
        Actor: {
            onMake: this.game.actors.process.bind(this.game.actors),
        },
        Menu: {
            hidden: true,
        },
        Player: {
            height: 32,
            groupType: "Players",
            width: 32,
        },
        Square: {
            height: 64,
            groupType: "Squares",
            width: 64,
        },
        Text: {
            groupType: "Text",
            height: 8,
            scale: 2,
            width: 8,
        },
    };
}
