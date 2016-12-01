import { Command } from "../command";
import { codeDir } from "../settings";
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
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IRunGulpInArgs): Promise<any> {
        await Command.execute(this.logger, EnsureRepositoryExists, args);

        const shell: Shell = new Shell(this.logger);

        shell.setCwd(codeDir, args.repository);
        await shell.execute("gulp setup && gulp");
    }
}
