import { Quadrants as QuadrantsBase } from "eightbittr";

import { FullScreenSaver } from "../FullScreenSaver";

/**
 * Arranges game physics quadrants.
 */
export class Quadrants<Game extends FullScreenSaver> extends QuadrantsBase<Game> {
    /**
     * Groups that should have their quadrants updated.
     */
    public readonly activeGroupNames: string[] = ["Players", "Squares"];
}
