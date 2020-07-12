import mkdirp from "mkdirp";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

const defaultDirectories = ["lib", "src", "test"];

/**
 * Ensures directories needed for setup exist.
 */
export const EnsureDirsExist = async (_runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    await Promise.all(
        defaultDirectories.map(async (directory) => {
            const directoryPath = path.join(args.directory, args.repository, directory);

            await mkdirp(directoryPath);
        })
    );
};
