import * as fs from "mz/fs";
import * as path from "path";

import { ensureArgsExist, IRepositoryCommandArgs } from "../command";

/**
 * Checks if a repository exists locally.
 */
export const DoesRepositoryExist = async (args: IRepositoryCommandArgs): Promise<boolean> => {
    ensureArgsExist(args, "directory", "repository");

    return fs.exists(path.join(args.directory, args.repository));
};
