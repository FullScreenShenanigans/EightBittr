import chalk from "chalk";
import { promises as fs } from "fs";
import * as path from "path";

import { filesDirName } from "../directories";
import { NameTransformer } from "../nameTransformer";
import { Runtime } from "../runtime.js";

const nameTransformer = new NameTransformer();

/**
 * Displays help info.
 */
export const Help = async (runtime: Runtime) => {
    runtime.logger.log(
        [
            chalk.bold.cyan("shenanigans-manager"),
            "manages locally installed FullScreenShenanigans modules for development.",
        ].join(" ")
    );

    runtime.logger.log("Available commands:");

    const files: string[] = await fs.readdir(path.join(filesDirName, "commands"));
    const commands: string[] = files
        .filter(
            (fileName: string): boolean => fileName.includes(".ts") && !fileName.includes(".d.ts")
        )
        .map((fileName: string): string => fileName.substring(0, fileName.length - ".ts".length));

    for (const file of commands) {
        runtime.logger.log(`    ${nameTransformer.toDashedCase(file)}`);
    }
};
