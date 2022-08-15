import chalk from "chalk";
import { promises as fs } from "fs";
import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command.js";
import { copyTemplatesRecursive } from "../copyTemplatesRecursive.js";
import { Runtime } from "../runtime.js";
import { getShenanigansPackageContents } from "../utils.js";
import { EnsureDirsExist } from "./ensureDirsExist.js";

/**
 * Args for a hydrate-files command.
 */
export interface HydrateFilesCommandArgs extends RepositoryCommandArgs {
    /**
     * Whether to also create basic source files for a new package.
     */
    bootstrap?: "external" | "internal";
}

/**
 * Updates a repository's scaffolding files.
 */
export const HydrateFiles = async (runtime: Runtime, args: HydrateFilesCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    await EnsureDirsExist(runtime, args);
    await copyTemplatesRecursive(runtime, args, "default");

    if (args.bootstrap) {
        await copyTemplatesRecursive(runtime, args, "bootstrap");
        await copyTemplatesRecursive(runtime, args, args.bootstrap);
    }

    const { shenanigans } = await getShenanigansPackageContents(args);

    if (shenanigans.external) {
        await copyTemplatesRecursive(runtime, args, "external");
    }

    if (shenanigans.web) {
        await copyTemplatesRecursive(runtime, args, "web");
    }

    if (shenanigans.dist) {
        // Optimization: copy everything from lib/ into dist/
        // (this way the same files don't need to be in shenanigans-manager twice)
        const outputDirectory = path.join(args.directory, args.repository);
        const libDir = path.join(outputDirectory, "lib");
        const distDir = path.join(outputDirectory, "dist");

        // First copy over everything from web, so we don't have to duplicate assets
        runtime.logger.log(chalk.grey(`Copying directory ${libDir} to ${distDir}`));
        await fs.cp(libDir, distDir, { force: false, recursive: true });

        // Override copied lib/ files with any new dist/ files
        await copyTemplatesRecursive(runtime, args, "dist");
    }
};
