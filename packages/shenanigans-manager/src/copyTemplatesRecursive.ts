import chalk from "chalk";
import { fs } from "mz";
import * as path from "path";

import { RepositoryCommandArgs } from "./command";
import { Mustache } from "./commands/mustache";
import { Runtime } from "./runtime";
import { globAsync, mkdirpSafe, setupDir } from "./utils";

const nonTextFileExtensions = new Set([".eot", ".gif", ".jpg", ".png", ".svg", ".ttf", ".woff"]);

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
            if (fs.statSync(setupFile).isDirectory()) {
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
