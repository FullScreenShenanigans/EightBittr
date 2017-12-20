import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";

/**
 * Links a repository globally.
 */
export const Link = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    ensureArgsExist(args, "directory", "repository");

    await new Shell(runtime.logger)
        .setCwd(args.directory, args.repository)
        .execute("npm link");
};
