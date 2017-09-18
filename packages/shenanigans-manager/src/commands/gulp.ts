import { Command, ICommandArgs } from "../command";
import { ICommandOutput, Shell } from "../shell";
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
export class Gulp extends Command<IGulpArgs, ICommandOutput> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<ICommandOutput> {
        this.ensureArgsExist("directory", "repository");

        await this.subroutine(EnsureRepositoryExists, this.args);

        return await new Shell(this.logger, this.args.directory, this.args.repository)
            .execute("gulp");
    }
}
