import {
    IExecuteBeginInfo, IExecuteEndInfo, IExecuteOutInfo,
    ILogger,
    IOnSetCwdInfo
} from "../logger";

/**
 * Logs on important events.
 */
export class ConsoleLogger implements ILogger {
    /**
     * Logs that executing a command has started.
     * 
     * @param info   Info about execution starting.
     */
    public onExecuteBegin(info: IExecuteBeginInfo): void {
        console.log(`Executing command: ${info.command}`);
    }

    /**
     * Logs that executing a command has started.
     * 
     * @param info   Info about execution ending.
     */
    public onExecuteEnd(info: IExecuteEndInfo): void {
        console.log(`Done executing with code ${info.code}: ${info.command}`);
    }

    /**
     * Logs that command execution has caused error information.
     * 
     * @param info   Info about the command error.
     */
    public onExecuteError(info: IExecuteOutInfo): void {
        console.log(`>${this.trim(info.data, " Err: ")}`);
    }

    /**
     * Logs that command execution has caused output information.
     * 
     * @param info   Info about the command output.
     */
    public onSetCwd(info: IOnSetCwdInfo): void {
        console.log(`Now in ${info.cwd}`);
    }

    /**
     * Logs that the current working directory has changed.
     * 
     * @param info   Info about the working directory change.
     */
    private trim(line: string, extra: string = ""): string {
        return extra + line
            .trim()
            .replace(/\n/g, `\n>${extra}`);
    }
}
