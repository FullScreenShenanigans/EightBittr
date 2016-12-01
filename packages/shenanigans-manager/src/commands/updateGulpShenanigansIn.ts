import { Command } from "../command";
import { codeDir } from "../settings";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for an UpdateGulpShenanigansIn command.
 */
export interface IUpdateGulpShenanigansInArgs {
    /**
     * Names of the repositoriy.
     */
    repository: string;
}

/**
 * Creates a repository locally.
 */
export class UpdateGulpShenanigansIn extends Command<IUpdateGulpShenanigansInArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IUpdateGulpShenanigansInArgs): Promise<any> {
        await Command.execute(this.logger, EnsureRepositoryExists, args);

        const shell: Shell = new Shell(this.logger);

        shell.setCwd(codeDir, args.repository);
        await shell.execute("npm install gulp-shenanigans@latest");
    }
}
