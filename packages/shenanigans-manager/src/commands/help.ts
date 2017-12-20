import chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

import { ICommandArgs } from "../command";
import { NameTransformer } from "../nameTransformer";
import { IRuntime } from "../runtime";

const nameTransformer = new NameTransformer();

/**
 * Displays help info.
 */
export const Help = async (runtime: IRuntime, args: ICommandArgs) => {
    runtime.logger.log([
        chalk.bold.cyan("shenanigans-manager"),
        "manages locally installed FullScreenShenanigans modules for development.",
    ].join(" "));

    runtime.logger.log("Available commands:");

    const files: string[] = await fs.readdir(path.join(__dirname, "../../src/commands"));
    const commands: string[] = files
        .filter((fileName: string): boolean =>
            fileName.indexOf(".ts") !== -1 && fileName.indexOf(".d.ts") === -1)
        .map((fileName: string): string =>
            fileName.substring(0, fileName.length - ".ts".length));

    for (const file of commands) {
        runtime.logger.log(`    ${nameTransformer.toDashedCase(file)}`);
    }

    runtime.logger.log([
        "Run with",
        chalk.bold("--all"),
        "to execute a command in all repositories.",
    ].join(" "));
};
