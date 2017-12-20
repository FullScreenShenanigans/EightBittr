import * as fs from "mz/fs";
import * as path from "path";

import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

/**
 * Checks if a repository exists locally.
 */
export const DoesRepositoryExist = async (runtime: IRuntime, args: IRepositoryCommandArgs): Promise<boolean> => {
    ensureArgsExist(args, "directory", "repository");

    return fs.exists(path.join(args.directory, args.repository));
};
