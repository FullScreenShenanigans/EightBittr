import { EightBittr } from "../EightBittr";

export const createContainer = (eightBitter: EightBittr) =>
    eightBitter.utilities.createElement<HTMLDivElement>("div", {
        children: [eightBitter.canvas],
        className: "EightBitter",
        style: {
            height: `${eightBitter.settings.height}px`,
            position: "relative",
            width: `${eightBitter.settings.width}px`,
        },
    });
