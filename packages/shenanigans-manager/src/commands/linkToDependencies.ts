import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { getDependencies } from "../utils";

/**
 * Arguments for a LinkToDependencies command.
 */
export interface ILinkToDependenciesArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Links a repository to its local dependencies.
 */
export class LinkToDependencies extends Command<ILinkToDependenciesArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        const shell: Shell = new Shell(this.logger)
            .setCwd(this.args.directory, this.args.repository);

        await shell.execute("npm link gulp-shenanigans");

        for (const dependency of Object.keys(
            await getDependencies([this.args.directory, this.args.repository], this.logger))
        ) {
            await shell.execute(`npm link ${dependency}`);
        }
    }
}
