import * as chalk from "chalk";

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
     * Logs general information.
     */
    public log(message?: any, ...args: any[]): void {
        console.log(message, ...args);
    }

    /**
     * Logs that executing a command has started.
     *
     * @param info   Info about execution starting.
     */
    public onExecuteBegin(info: IExecuteBeginInfo): void {
        console.log(chalk.grey("Executing command:"), info.command);
    }

    /**
     * Logs that executing a command has started.
     *
     * @param info   Info about execution ending.
     */
    public onExecuteEnd(info: IExecuteEndInfo): void {
        const codeString: string = info.code === 0
            ? chalk.green("0")
            : chalk.red(info.code.toString());

        console.log(chalk.grey("Done executing with code"), `${codeString}: ${chalk.grey(info.command)}`, "\n");
    }

    /**
     * Logs that command execution has caused error information.
     *
     * @param info   Info about the command error.
     */
    public onExecuteError(info: IExecuteOutInfo): void {
        console.log(chalk.red(`>${this.trim(info.data, " Err: ")}`));
    }

    /**
     * Logs that command execution has caused output information.
     *
     * @param info   Info about the command output.
     */
    public onSetCwd(info: IOnSetCwdInfo): void {
        console.log(chalk.grey.italic(`Now in ${info.cwd}`));
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
