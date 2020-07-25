import mkdirp from "mkdirp";
import * as path from "path";

import { defaultPathArgs, RepositoryCommandArgs } from "../command";
import { Runtime } from "../runtime";

const defaultDirectories = ["lib", "src", "test"];

/**
 * Ensures directories needed for setup exist.
 */
export const EnsureDirsExist = async (_runtime: Runtime, args: RepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    await Promise.all(
        defaultDirectories.map(async (directory) => {
            const directoryPath = path.join(args.directory, args.repository, directory);

            await mkdirp(directoryPath);
        })
    );
};
