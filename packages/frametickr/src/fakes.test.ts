import * as timers from "@sinonjs/fake-timers";
import * as sinon from "sinon";

import { FrameTickr } from "./FrameTickr";
import { FrameTickrSettings } from "./types";

export const stubFrameTickr = (settings: Partial<FrameTickrSettings> = {}) => {
    const clock = timers.createClock();

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
