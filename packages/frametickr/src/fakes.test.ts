import * as sinon from "sinon";
import { useFakeTimers } from "sinon-timers-repeatable";

import { FrameTickr } from "./FrameTickr";
import { FrameTickrSettings } from "./types";

export const stubFrameTickr = (settings: Partial<FrameTickrSettings> = {}) => {
    const clock = useFakeTimers();

    const frameTicker = new FrameTickr({
        frame: sinon.spy(),
        timing: {
            cancelFrame: clock.clearTimeout,
            getTimestamp: () => clock.now,
            requestFrame: (callback) =>
                clock.setTimeout(() => {
                    callback(clock.now);
                }, 1),
        },
        ...settings,
    });

    return { clock, frameTicker };
};
