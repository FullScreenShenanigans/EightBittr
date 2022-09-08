import { Graphics as EightBittrGraphics } from "eightbittr";
import { Palette } from "pixelrendr";

import { InfiniteContributionsCalendar } from "../InfiniteContributionsCalendar";

export class Graphics<
    Game extends InfiniteContributionsCalendar
> extends EightBittrGraphics<Game> {
    public readonly background = "white";

    public readonly library = {
        SquareL0: "0x18,0x180,0x18,0",
        SquareL1: "0x28,0x280,0x28,0",
        SquareL2: "0x38,0x380,0x38,0",
        SquareL3: "0x48,0x480,0x48,0",
        SquareL4: "0x58,0x580,0x58,0",
    };

    public readonly paletteDefault: Palette = [
        [0, 0, 0, 0],
        [255, 255, 255, 255],
        // --color-calendar-graph-day-L1-bg: #9be9a8;
        [155, 233, 168, 255],
        // --color-calendar-graph-day-L2-bg: #40c463;
        [64, 196, 99, 255],
        // --color-calendar-graph-day-L3-bg: #30a14e;
        [48, 161, 78, 255],
        // --color-calendar-graph-day-L4-bg: #216e39;
        [33, 110, 57, 255],
    ];
}
