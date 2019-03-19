/**
 * Callback that can receive a timestamp from an `IRequestFrame`.
 *
 * @param timestamp   High resolution current timestamp.
 */
export type IFrameCallback = (timestamp: DOMHighResTimeStamp) => void;

/**
 * Cancels requesting a next frame.
 *
 * @param handle   Cancellation token for a next frame request.
 */
export type ICancelFrame = (handle: unknown) => void;

/**
 * @returns Current high-resolution timestamp.
 */
export type IGetTimestamp = () => DOMHighResTimeStamp;

/**
 * Schedules a tick for the next available frame.
 *
 * @param callback   Next tick to run.
 * @returns Cancellation token for the next tick.
 */
export type IRequestFrame = (callback: IFrameCallback) => unknown;

/**
 * Hooks for retrieving and scheduling timing.
 */
export interface IFrameTiming {
    /**
     * Cancels a next tick (by default, `cancelAnimationFrame`).
     */
    cancelFrame: ICancelFrame;

    /**
     * Gets a current timestamp (by default, `performance.now`).
     */
    getTimestamp: IGetTimestamp;

    /**
     * Schedules a next tick (by default, `requestAnimationFrame`).
     */
    requestFrame: IRequestFrame;
}

/**
 * Creates hooks for retrieving and scheduling timing.
 *
 * @param getTimestamp   Gets a current timestamp.
 * @returns Hooks for retrieving and scheduling timing.
 */
export const createFrameTiming = (
    getTimestamp: IGetTimestamp = () => performance.now(),
): IFrameTiming => {
    const messagePrefix = `FrameTickrMessageData${Math.random()}`;
    const callbacks: { [i: string]: IFrameCallback | undefined } = {};
    let callHandles = 0;

    const cancelFrame: ICancelFrame = (handle: number) => {
        delete callbacks[handle];
    };

    const onMessage = (event: MessageEvent) => {
        if (
            event.source !== window
            || typeof event.data !== "string"
            || event.data.indexOf(messagePrefix) === -1
        ) {
            return;
        }

        const callback = callbacks[event.data.substring(messagePrefix.length)];
        if (!callback) {
            return;
        }

        callback(getTimestamp());
    };

    const requestFrame: IRequestFrame = (callback: IFrameCallback) => {
        const newHandle = `${callHandles += 1}`;

        callbacks[newHandle] = callback;
        window.postMessage(`${messagePrefix}${newHandle}`, "*");

        return newHandle;
    };

    window.addEventListener("message", onMessage);

    return { cancelFrame, getTimestamp, requestFrame };
};
