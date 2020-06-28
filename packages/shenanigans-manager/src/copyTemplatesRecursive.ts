import { fs } from "mz";
import * as path from "path";

import { IRuntime } from "./runtime";
import { globAsync, setupDir } from "./utils";
import { IRepositoryCommandArgs } from "./command";
import { Mustache } from "./commands/mustache";

/**
 * Recursively copies all files as Mustache templates in a directory.
 */
export const copyTemplatesRecursive = async (
    runtime: IRuntime,
    args: IRepositoryCommandArgs,
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
            await Mustache(runtime, {
                ...args,
                input: setupFile,
                output: outputAbsolute,
            });
        })
    );
};
