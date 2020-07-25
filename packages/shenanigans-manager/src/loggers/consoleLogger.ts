import chalk from "chalk";

import { Logger, OnSetCwdInfo } from "../logger";

/**
 * Logs on important events.
 */
export class ConsoleLogger implements Logger {
    public constructor(
        public readonly stderr: NodeJS.WriteStream,
        public readonly stdout: NodeJS.WriteStream
    ) {}

    /**
     * Logs general information.
     *
     * @param message   Message to log.
     */
    public log(message: string): void {
        console.log(message);
    }

    /**
     * Logs that command execution has caused output information.
     *
     * @param info   Info about the command output.
     */
    public onSetCwd(info: OnSetCwdInfo): void {
        console.log(chalk.grey.italic(`Now in ${info.cwd}`));
    }
}
