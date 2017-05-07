import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";

/**
 * Arguments for an Exec command.
 */
export interface IExecArgs extends ICommandArgs {
    /**
     * Command to execute.
     */
    exec: string;

    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Executes a command in a repository.
 */
export class Exec extends Command<IExecArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("exec", "repository");

        await new Shell(this.logger)
            .setCwd(this.args.directory)
            .execute(this.args.exec);
    }
}
