import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";

/**
 * Arguments for an Exec command.
 */
export interface IExecArgs extends IRepositoryCommandArgs {
    /**
     * Command to execute.
     */
    spawn: string;
}

/**
 * Executes a command in a repository.
 */
export const Exec = async (runtime: IRuntime, args: IExecArgs): Promise<number> => {
    ensureArgsExist(args, "spawn", "repository");

    return new Shell(runtime.logger)
        .setCwd(args.directory, args.repository)
        .execute(args.spawn);
};
