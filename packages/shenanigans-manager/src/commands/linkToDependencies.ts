import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";
import { getDependencies } from "../utils";

/**
 * Links a repository to its local dependencies.
 */
export const LinkToDependencies = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    ensureArgsExist(args, "directory", "repository");

    const shell: Shell = new Shell(runtime.logger)
        .setCwd(args.directory, args.repository);

    await shell.execute("npm link shenanigans-manager");

    for (const dependency of Object.keys(
        await getDependencies([args.directory, args.repository], runtime.logger))
    ) {
        await shell.execute(`npm link ${dependency}`);
    }
};
