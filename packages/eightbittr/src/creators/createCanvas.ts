import { EightBittr } from "../EightBittr";

export const createCanvas = (eightBitter: EightBittr) =>
    eightBitter.utilities.createCanvas(
        eightBitter.settings.width,
        eightBitter.settings.height
    );
