import { Objects as ObjectsBase } from "eightbittr";
import { ClassInheritance, ClassProperties } from "objectmakr";

import { InfiniteContributionsCalendar } from "../InfiniteContributionsCalendar";

/**
 * Raw ObjectMakr factory settings.
 */
export class Objects<Game extends InfiniteContributionsCalendar> extends ObjectsBase<Game> {
    public readonly inheritance: ClassInheritance = {
        Actor: {
            Square: {
                SquareL0: {},
                SquareL1: {},
                SquareL2: {},
                SquareL3: {},
                SquareL4: {},
            },
        },
    };

    public readonly onMake = "onMake";

    public readonly properties: ClassProperties = {
        Actor: {
            onMake: this.game.actors.process.bind(this.game.actors),
        },
        Square: {
            height: 10,
            groupType: "Squares",
            width: 10,
        },
    };
}
