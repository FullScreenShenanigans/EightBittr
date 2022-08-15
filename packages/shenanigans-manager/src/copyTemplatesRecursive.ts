import chalk from "chalk";
import { existsSync, promises as fs } from "fs";
import * as path from "path";

import { RepositoryCommandArgs } from "./command.js";
import { Mustache } from "./commands/mustache.js";
import { Runtime } from "./runtime.js";
import { globAsync, mkdirpSafe, setupDir } from "./utils.js";

const nonTextFileExtensions = new Set([".gif", ".jpg", ".png", ".svg", ".woff2"]);

/**
 * Recursively copies all files as Mustache templates in a directory.
 */
export const copyTemplatesRecursive = async (
    runtime: Runtime,
    args: RepositoryCommandArgs,
    directory: string,
    rootDirectory = directory
) => {
    const files = await globAsync(path.join(setupDir, directory, "*"));

    await Promise.all(
        files.map(async (setupFile) => {
            if ((await fs.stat(setupFile)).isDirectory()) {
                return await copyTemplatesRecursive(
                    runtime,
                    args,
                    setupFile.slice(setupDir.length),
                    rootDirectory
                );
            }

            const outputLocal = `./${setupFile.slice(
                setupFile.indexOf(directory) + rootDirectory.length + 1
            )}`;
            const outputAbsolute = path.join(args.directory, args.repository, outputLocal);

            if (nonTextFileExtensions.has(path.extname(outputLocal))) {
                runtime.logger.log(chalk.grey(`Copying ${outputAbsolute}`));
                await mkdirpSafe(path.dirname(outputAbsolute));

                if (existsSync(outputAbsolute)) {
                    await fs.rm(outputAbsolute);
                }

                await fs.copyFile(setupFile, outputAbsolute);
            } else {
                await Mustache(runtime, {
                    ...args,
                    input: setupFile,
                    output: outputAbsolute,
                });
            }
        })
    );
};
