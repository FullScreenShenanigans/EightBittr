/**
 * Log information about command execution events.
 */
export interface IExecuteInfo {
    /**
     * The executed command.
     */
    command: string;
}

/**
 * Log information about command execution beginning.
 */
export interface IExecuteBeginInfo extends IExecuteInfo { }

/**
 * Log information about command execution ending.
 */
export interface IExecuteEndInfo extends IExecuteInfo {
    /**
     * Resultant status code.
     */
    code: number;

    /**
     * Total output error information.
     */
    stderr: string;

    /**
     * Total output information.
     */
    stdout: string;
}

/**
 * Log information about command execution outputting.
 */
export interface IExecuteOutInfo extends IExecuteInfo {
    /**
     * Added information to the log.
     */
    data: string;

    /**
     * Total logged error information.
     */
    stderr: string;

    /**
     * Total logged output information.
     */
    stdout: string;
}

/**
 * Log information about a working directory change.
 */
export interface IOnSetCwdInfo {
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
export interface ILogger {
    /**
     * Logs that executing a command has started.
     * 
     * @param info   Info about execution starting.
     */
    onExecuteBegin(info: IExecuteBeginInfo): void;

    /**
     * Logs that executing a command has started.
     * 
     * @param info   Info about execution ending.
     */
    onExecuteEnd(info: IExecuteEndInfo): void;

    /**
     * Logs that command execution has caused error information.
     * 
     * @param info   Info about the command error.
     */
    onExecuteError(info: IExecuteOutInfo): void;

    /**
     * Logs that command execution has caused output information.
     * 
     * @param info   Info about the command output.
     */
    onExecuteOut(info: IExecuteOutInfo): void;

    /**
     * Logs that the current working directory has changed.
     * 
     * @param info   Info about the working directory change.
     */
    onSetCwd(info: IOnSetCwdInfo): void;
}
