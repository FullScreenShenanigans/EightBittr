import * as lolex from "lolex";
import * as sinon from "sinon";

import { FrameTickr } from "./FrameTickr";
import { IFrameTickrSettings } from "./IFrameTickr";

export const stubFrameTickr = (settings: Partial<IFrameTickrSettings> = {}) => {
    const clock = lolex.createClock();

    const frameTicker = new FrameTickr({
        frame: sinon.spy(),
        timing: {
            cancelFrame: clock.clearTimeout,
            getTimestamp: () => clock.now,
            requestFrame: (callback) =>
                clock.setTimeout(
                    () => {
                        callback(clock.now);
                    },
                    1),
        },
        ...settings,
    });

    return { clock, frameTicker };
};
