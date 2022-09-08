import { InfiniteContributionsCalendar } from "InfiniteContributionsCalendar";
import { WorldSeedr } from "worldseedr";

export const createWorldSeeder = (game: InfiniteContributionsCalendar) =>
    new WorldSeedr({
        possibilities: {
            Area: {
                children: {
                    size: {
                        height: game.settings.height,
                        width: 10,
                    },
                    title: "Column",
                    type: "Possibility",
                },
                direction: "right",
                repeat: Infinity,
                size: {
                    height: game.settings.height,
                    width: game.settings.width,
                },
                spacing: 2,
            },
            Column: {
                children: {
                    size: {
                        height: 10,
                        width: 10,
                    },
                    title: ["SquareL0", "SquareL1", "SquareL2", "SquareL3", "SquareL4"].map(
                        (value) => ({
                            probability: 20,
                            value,
                        })
                    ),
                    type: "Result",
                },
                direction: "bottom",
                repeat: Infinity,
                size: {
                    height: game.settings.height,
                    width: 10,
                },
                spacing: 2,
            },
        },
    });
