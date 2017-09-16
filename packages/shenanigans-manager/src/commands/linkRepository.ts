import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { getDependencies } from "../utils";

/**
 * Arguments for a LinkRepository command.
 */
export interface ILinkRepositoryArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Links a repository to its local dependencies.
 */
export class LinkRepository extends Command<ILinkRepositoryArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        await this.linkToRepository("gulp-shenanigans");

        for (const dependency of Object.keys(
            await getDependencies([this.args.directory, this.args.repository], this.logger))
        ) {
            await this.linkToRepository(dependency);
        }
    }

    /**
     * Links to a repository under a subdirectory.
     *
     * @param packageName   Package name to link to.
     * @returns A Promise for creating a symlink.
     */
    private async linkToRepository(packageName: string): Promise<void> {
        await new Shell(this.logger).execute(`npm link ${packageName}`);
    }
}
