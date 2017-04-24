import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a RunGulpIn command.
 */
export interface IRunGulpInArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Runs gulp-setup in a repository.
 */
export class RunGulpSetupIn extends Command<IRunGulpInArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        await this.subroutine(EnsureRepositoryExists, this.args);

        await new Shell(this.logger, this.args.directory, this.args.repository)
            .execute("gulp setup");
    }
}
