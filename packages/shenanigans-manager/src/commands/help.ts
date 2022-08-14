import chalk from "chalk";
import { promises as fs } from "fs";
import * as path from "path";

import { filesDirName } from "../directories.js";
import { NameTransformer } from "../nameTransformer.js";
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

    const files = await fs.readdir(path.join(filesDirName, "commands"));
    const commands = files
        .filter((fileName) => fileName.endsWith(".js"))
        .map((fileName) => path.parse(fileName).name);

    for (const file of commands) {
        runtime.logger.log(`    ${nameTransformer.toDashedCase(file)}`);
    }
};
