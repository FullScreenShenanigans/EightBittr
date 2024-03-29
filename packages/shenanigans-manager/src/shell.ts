import chalk from "chalk";
import { spawn } from "child_process";
import * as path from "path";

import { Logger } from "./logger.js";

const isWindows = () => process.platform === "win32";

const commandAliases: Record<string, string | undefined> = isWindows()
    ? {
          git: "git.exe",
          npm: "npm.cmd",
          yarn: "yarn.cmd",
      }
    : {};

/**
 * Runs shell commands.
 */
export class Shell {
    /**
     * Logs on important events.
     */
    private readonly logger: Logger;

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
    public constructor(logger: Logger, ...pathComponents: string[]) {
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
        const pathComponents: string[] = rawPathComponents.filter(
            (pathComponent) => pathComponent !== undefined
        ) as string[];

        const cwd = path.resolve(path.join(...pathComponents));
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
        const commandAlias = commandAliases[command] ?? command;

        this.logger.log(chalk.grey(`> ${commandAlias} ${args.join(" ")}`));

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
