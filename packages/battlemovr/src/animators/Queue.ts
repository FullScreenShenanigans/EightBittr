/**
 * A callback that may be run in a queue.
 *
 * @param next   Handler for when it's done.
 */
export type IQueueCallback = (next: () => void) => void;

/**
 * Queues callbacks to be run.
 */
export class Queue {
    /**
     * Callbacks waiting to be run.
     */
    private readonly queuedCallbacks: IQueueCallback[] = [];

    /**
     * Queues an callback, if it exists.
     *
     * @param callback   A callback that may or may not exist.
     */
    public add(callback?: IQueueCallback): void {
        if (callback !== undefined) {
            this.queuedCallbacks.push(callback);
        }
    }

    /**
     * Runs the queued animations.
     *
     * @param onComplete   Handler for when animations are done.
     */
    public run(onComplete: () => void): void {
        const callback:
            | IQueueCallback
            | undefined = this.queuedCallbacks.shift();

        if (callback !== undefined) {
            callback((): void => {
                this.run(onComplete);
            });
        } else {
            onComplete();
        }
    }

    /**
     * Removes any pending queued callbacks.
     */
    public clear(): void {
        this.queuedCallbacks.length = 0;
    }
}
