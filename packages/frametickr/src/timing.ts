/**
 * Callback that can receive a timestamp from an `IRequestFrame`.
 *
 * @param timestamp   High resolution current timestamp.
 */
export type FrameCallback = (timestamp: DOMHighResTimeStamp) => void;

/**
 * Cancels requesting a next frame.
 *
 * @param handle   Cancellation token for a next frame request.
 */
export type CancelFrame = (handle: unknown) => void;

/**
 * @returns Current high-resolution timestamp.
 */
export type GetTimestamp = () => DOMHighResTimeStamp;

/**
 * Schedules a tick for the next available frame.
 *
 * @param callback   Next tick to run.
 * @returns Cancellation token for the next tick.
 */
export type RequestFrame = (callback: FrameCallback) => unknown;

/**
 * Hooks for retrieving and scheduling timing.
 */
export interface FrameTiming {
    /**
     * Cancels a next tick (by default, `cancelAnimationFrame`).
     */
    cancelFrame: CancelFrame;

    /**
     * Gets a current timestamp (by default, `performance.now`).
     */
    getTimestamp: GetTimestamp;

    /**
     * Schedules a next tick (by default, `requestAnimationFrame`).
     */
    requestFrame: RequestFrame;
}

/**
 * Creates hooks for retrieving and scheduling timing.
 *
 * @param getTimestamp   Gets a current timestamp.
 * @returns Hooks for retrieving and scheduling timing.
 */
export const createFrameTiming = (
    getTimestamp: GetTimestamp = () => performance.now()
): FrameTiming => {
    const messagePrefix = `FrameTickrMessageData${Math.random()}`;
    const callbacks: Record<string, FrameCallback | undefined> = {};
    let callHandles = 0;

    const cancelFrame: CancelFrame = (handle: number) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete callbacks[handle];
    };

    const onMessage = (event: MessageEvent) => {
        if (
            event.source !== window ||
            typeof event.data !== "string" ||
            !event.data.includes(messagePrefix)
        ) {
            return;
        }

        const callback = callbacks[event.data.substring(messagePrefix.length)];
        if (!callback) {
            return;
        }

        callback(getTimestamp());
    };

    const requestFrame: RequestFrame = (callback: FrameCallback) => {
        const newHandle = `${(callHandles += 1)}`;

        callbacks[newHandle] = callback;
        window.postMessage(`${messagePrefix}${newHandle}`, "*");

        return newHandle;
    };

    window.addEventListener("message", onMessage);

    return { cancelFrame, getTimestamp, requestFrame };
};
