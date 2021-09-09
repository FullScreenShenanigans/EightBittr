import { EightBittr } from "../EightBittr";

export const createContainer = (game: EightBittr) =>
    game.utilities.createElement<HTMLDivElement>("div", {
        children: [game.background, game.foreground],
        className: "EightBitter",
        style: {
            height: `${game.settings.height}px`,
            position: "relative",
            width: `${game.settings.width}px`,
        },
    });
