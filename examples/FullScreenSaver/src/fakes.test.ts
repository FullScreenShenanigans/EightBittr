import { useFakeTimers } from "sinon-timers-repeatable";

import { FullScreenSaver } from "./FullScreenSaver";

export const mockHeight = 480;

export const mockWidth = 320;

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
        height: mockHeight,
        width: mockWidth,
    });

    game.frameTicker.play();

    return { clock, game };
};
