import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";

import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Runs tslint --fix in a repository.
 */
export const TslintFix = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    ensureArgsExist(args, "directory", "repository");

    await EnsureRepositoryExists(runtime, args);

    return new Shell(runtime.logger, args.directory, args.repository)
        .execute("npm run src:tslint:fix");
};
