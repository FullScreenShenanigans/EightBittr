import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a Gulp command.
 */
export interface IGulpArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Runs gulp in a repository.
 */
export class Gulp extends Command<IGulpArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        await this.subroutine(EnsureRepositoryExists, this.args);

        await new Shell(this.logger, this.args.directory, this.args.repository)
            .execute("gulp");
    }
}
