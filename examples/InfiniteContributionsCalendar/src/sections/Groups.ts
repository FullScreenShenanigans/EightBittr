import { Groups as EightBittrGroups } from "eightbittr";

import { InfiniteContributionsCalendar } from "../InfiniteContributionsCalendar";

export class Groups<Game extends InfiniteContributionsCalendar> extends EightBittrGroups<Game> {
    public readonly groupNames = ["Players", "Squares", "Text"];
}
