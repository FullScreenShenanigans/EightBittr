import { useFakeTimers } from "sinon-timers-repeatable";

import { FullScreenSaver } from "./FullScreenSaver";

export const createFullScreenSaver = () => {
    const clock = useFakeTimers();

    const game = new FullScreenSaver({
        components: {
            frameTicker: {
                timing: {
                    cancelFrame: clock.clearTimeout,
                    getTimestamp: () => clock.now,
                    requestFrame: (callback) =>
                        clock.setTimeout(() => {
                            callback(clock.now);
                        }, 1),
                },
            },
        },
        height: 320,
        width: 480,
    });

    game.frameTicker.play();

    return { clock, game };
};
