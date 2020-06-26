import { fs } from "mz";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { getShenanigansPackageContents, globAsync, setupDir } from "../utils";
import { EnsureDirsExist } from "./ensureDirsExist";
import { Mustache } from "./mustache";

/**
 * Args for a hydrate-files command.
 */
export interface IHydrateFilesCommandArgs extends IRepositoryCommandArgs {
    /**
     * Whether to also create basic source files for a new package.
     */
    bootstrap?: "external" | "internal";
}

/**
 * Updates a repository's scaffolding files.
 */
export const HydrateFiles = async (runtime: IRuntime, args: IHydrateFilesCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const hydrateFiles = async (directory: string, rootDirectory = directory) => {
        const files = await globAsync(path.join(setupDir, directory, "*"));

        await Promise.all(
            files.map(async (setupFile) => {
                if (fs.statSync(setupFile).isDirectory()) {
                    return await hydrateFiles(setupFile.slice(setupDir.length), rootDirectory);
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

    await EnsureDirsExist(runtime, args);
    await hydrateFiles("default");

    if (args.bootstrap) {
        await hydrateFiles("bootstrap");
        await hydrateFiles(args.bootstrap);
    }

    const { shenanigans } = await getShenanigansPackageContents(args);

    if (shenanigans.dist) {
        await hydrateFiles("dist");
    }
};
