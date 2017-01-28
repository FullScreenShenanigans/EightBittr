import { Command } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a RunGulpIn command.
 */
export interface IRunGulpInArgs {
    /**
     * Names of the repositoriy.
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
     * @param args   Arguments for the command.
     * @returns A Promise for running the command.
     */
    public async execute(args: IRunGulpInArgs): Promise<any> {
        await this.subroutine(EnsureRepositoryExists, args);

        const shell: Shell = new Shell(this.logger);

        shell.setCwd(this.settings.codeDir, args.repository);
        await shell.execute("gulp setup && gulp");
    }
}
