import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a RunGulpIn command.
 */
export interface IRunGulpInArgs extends ICommandArgs {
    /**
     * Names of the repository.
     */
    repository: string;
}

/**
 * Creates a repository locally.
 */
export class RunGulpIn extends Command<IRunGulpInArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        await this.subroutine(EnsureRepositoryExists, this.args);

        const shell: Shell = new Shell(this.logger);

        shell.setCwd(this.args.directory, this.args.repository);
        await shell.execute("gulp setup && gulp");
    }
}
