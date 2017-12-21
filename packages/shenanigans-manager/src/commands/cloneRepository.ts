import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";
import { LinkToDependencies } from "./linkToDependencies";

/**
 * Arguments for a CloneRepository command.
 */
export interface ICloneRepositoryArgs extends IRepositoryCommandArgs {
    /**
     * GitHub user or organization to clone from, if not FullScreenShenanigans.
     */
    fork?: string;
}

/**
 * Clones a repository locally.
 */
export const CloneRepository = async (runtime: IRuntime, args: ICloneRepositoryArgs) => {
    ensureArgsExist(args, "directory", "repository");

    const shell: Shell = new Shell(runtime.logger);
    const organization = args.fork === undefined
        ? runtime.settings.organization
        : args.fork;

    await shell
        .setCwd(args.directory)
        .execute(`git clone https://github.com/${organization}/${args.repository}`);
};
