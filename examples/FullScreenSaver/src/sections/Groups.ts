import { Groups as EightBittrGroups } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

export class Groups<Game extends FullScreenSaver> extends EightBittrGroups<Game> {
    public readonly groupNames = ["Players", "Squares", "Text"];
}
