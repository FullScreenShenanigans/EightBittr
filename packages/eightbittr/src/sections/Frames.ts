import { IFrame } from "frametickr";

import { EightBittr } from "../EightBittr";

import { Section } from "./Section";

/**
 * How to advance each frame of the game.
 */
export class Frames<TEightBittr extends EightBittr> extends Section<TEightBittr> {
    /**
     * Function run each frame of the game, on the interval.
     */
    public readonly tick: IFrame;

    /**
     * How many milliseconds should be between each game tick.
     */
    public readonly interval?: number;
}
