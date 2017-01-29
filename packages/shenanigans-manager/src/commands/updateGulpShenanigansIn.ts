import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for an UpdateGulpShenanigansIn command.
 */
export interface IUpdateGulpShenanigansInArgs extends ICommandArgs {
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
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        await this.subroutine(EnsureRepositoryExists, this.args);

        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.args.directory, this.args.repository)
            .execute("npm install gulp-shenanigans@latest");
    }
}
