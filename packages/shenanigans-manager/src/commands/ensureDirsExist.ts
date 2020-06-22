import mkdirp from "mkdirp";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

const defaultDirectories = ["dist", "src", "test"];

/**
 * Ensures directories needed for setup exist.
 */
export const EnsureDirsExist = async (
    _runtime: IRuntime,
    args: IRepositoryCommandArgs
) => {
    defaultPathArgs(args, "directory", "repository");

    const promises: Promise<unknown>[] = [];

    for (const directory of defaultDirectories) {
        const directoryPath = path.join(
            args.directory,
            args.repository,
            directory
        );

        promises.push(mkdirp(directoryPath));
    }

    await Promise.all(promises);
};
