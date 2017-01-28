import { Command } from "../command";
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
 * Updates gulp-shenanigans in a repository.
 */
export class UpdateGulpShenanigansIn extends Command<IUpdateGulpShenanigansInArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IUpdateGulpShenanigansInArgs): Promise<any> {
        await this.subroutine(EnsureRepositoryExists, args);

        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.settings.codeDir, args.repository)
            .execute("npm install gulp-shenanigans@latest");
    }
}
