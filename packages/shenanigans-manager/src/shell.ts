import chalk from "chalk";
import { spawn } from "child_process";
import * as path from "path";

import { ILogger } from "./logger";

const commandAliases: { [i: string]: string | undefined } = {
    npm: process.platform === "win32"
        ? "npm.cmd"
        : undefined,
};

/**
 * Runs shell commands.
 */
export class Shell {
    /**
     * Logs on important events.
     */
    private readonly logger: ILogger;

    /**
     * Current working directory.
     */
    private cwd = ".";

    /**
     * Initializes a new instance of the Shell class.
     *
     * @param logger   Logs on important events.
     * @param pathComponents   Path components for the initial directory.
     */
    public constructor(logger: ILogger, ...pathComponents: string[]) {
        this.logger = logger;

        if (pathComponents.length !== 0) {
            this.setCwd(...pathComponents);
        }
    }

    /**
     * Sets the current working directory.
     *
     * @param rawPathComponents   Path components for the directory.
     * @returns this
     */
    public setCwd(...rawPathComponents: (string | undefined)[]): this {
        const pathComponents: string[] = rawPathComponents.filter((pathComponent) => pathComponent !== undefined) as string[];

        const cwd: string = path.resolve(path.join(...pathComponents));
        this.cwd = cwd;

        if (this.logger.onSetCwd !== undefined) {
            this.logger.onSetCwd({ cwd, pathComponents });
        }

        return this;
    }

    /**
     * Runs a shell command.
     *
     * @param fullCommand   Command to execute, including args.
     * @returns A Promise for the result code of the command.
     */
    public async execute(fullCommand: string): Promise<number> {
        const [command, ...args] = fullCommand.split(" ");
        const commandAlias = commandAliases[command] !== undefined
            ? commandAliases[command] as string
            : command;

        this.logger.log(chalk.grey(`> ${fullCommand}`));

        return new Promise<number>((resolve, reject): void => {
            const childProcess = spawn(commandAlias, args, {
                cwd: this.cwd,
                stdio: "inherit",
            });

            childProcess.on("error", reject);
            childProcess.on("close", resolve);
        });
    }
}
