import { ensureArgsExist, RepositoryCommandArgs } from "../command";
import { Runtime } from "../runtime";
import { Shell } from "../shell";

/**
 * Arguments for an Exec command.
 */
export interface ExecArgs extends RepositoryCommandArgs {
    /**
     * Command to execute.
     */
    spawn: string;
}

/**
 * Executes a command in a repository.
 */
export const Exec = async (runtime: Runtime, args: ExecArgs): Promise<number> => {
    ensureArgsExist(args, "spawn", "repository");

    return new Shell(runtime.logger).setCwd(args.directory, args.repository).execute(args.spawn);
};
