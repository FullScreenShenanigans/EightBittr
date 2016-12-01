import {
    IExecuteBeginInfo, IExecuteEndInfo, IExecuteOutInfo,
    ILogger,
    IOnSetCwdInfo
} from "../logger";

/**
 * 
 */
export class ConsoleLogger implements ILogger {
    /**
     * 
     */
    public onExecuteBegin(info: IExecuteBeginInfo): void {
        console.log(`Executing command: ${info.command}`);
    }

    /**
     * 
     */
    public onExecuteEnd(info: IExecuteEndInfo): void {
        console.log(`\tDone executing with code ${info.code}: ${info.command}`);
    }

    /**
     * 
     */
    public onExecuteError(info: IExecuteOutInfo): void {
        console.log(`\t>${this.trim(info.data, " Err: ")}`);
    }

    /**
     * 
     */
    public onExecuteOut(info: IExecuteOutInfo): void {
        console.log(`\t>${this.trim(info.data, " Out: ")}`);
    }

    /**
     * 
     */
    public onSetCwd(info: IOnSetCwdInfo): void {
        console.log(`Now in ${info.cwd}`);
    }

    /**
     * 
     */
    private trim(line: string, extra: string = ""): string {
        return extra + line
            .trim()
            .replace(/\n/g, `\n\t>${extra}`);
    }
}
