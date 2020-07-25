import { defaultPathArgs, RepositoryCommandArgs } from "../command";
import { Runtime } from "../runtime";
import { getShenanigansPackageContents } from "../utils";
import { EnsureDirsExist } from "./ensureDirsExist";
import { copyTemplatesRecursive } from "../copyTemplatesRecursive";

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

    if (shenanigans.dist) {
        await copyTemplatesRecursive(runtime, args, "dist");
    }

    if (shenanigans.external) {
        await copyTemplatesRecursive(runtime, args, "external");
    }

    if (shenanigans.web) {
        await copyTemplatesRecursive(runtime, args, "web");
    }
};
