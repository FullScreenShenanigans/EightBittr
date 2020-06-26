import chalk from "chalk";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { getShenanigansPackageContents, globAsync, setupDir } from "../utils";
import { Mustache } from "./mustache";

/**
 * Updates a repository's scaffolding files.
 */
export const HydrateFiles = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const hydrateFiles = async (directory: string) => {
        const files = await globAsync(path.join(setupDir, directory, "*"));

        await Promise.all(
            files.map(async (setupFile) => {
                runtime.logger.log(chalk.grey(`Hydrating ${setupFile}`));
                await Mustache(runtime, {
                    ...args,
                    input: setupFile,
                    output: `./${setupFile.slice(setupFile.lastIndexOf("/") + 1)}`,
                });
            })
        );
    };

    const { shenanigans } = await getShenanigansPackageContents(args);

    if (shenanigans.dist) {
        await hydrateFiles("dist");
    }
};
