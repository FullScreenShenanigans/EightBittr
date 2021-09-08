/**
 * Log information about a working directory change.
 */
export interface OnSetCwdInfo {
    /**
     * The new current working directory.
     */
    cwd: string;

    /**
     * Path components that generated the cwd.
     */
    pathComponents: string[];
}

/**
 * Logs on important events.
 */
export interface Logger {
    /**
     * Logs general information.
     *
     * @param message   Message to log.
     */
    log(message: string): void;

    /**
     * Logs that the current working directory has changed.
     *
     * @param info   Info about the working directory change.
     */
    onSetCwd?(info: OnSetCwdInfo): void;

    /**
     * Standard process stdout stream.
     */
    stdout: NodeJS.WriteStream;

    /**
     * Standard process stderr stream.
     */
    stderr: NodeJS.WriteStream;
}
