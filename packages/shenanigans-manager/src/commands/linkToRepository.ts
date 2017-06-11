import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { ensurePathExists, getDependencies } from "../utils";

/**
 * Arguments for a LinkToRepository command.
 */
export interface ILinkToRepositoryArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Links a repository to its local dependencies.
 */
export class LinkToRepository extends Command<ILinkToRepositoryArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        for (const repository of this.settings.allRepositories) {
            if (repository === this.args.repository) {
                continue;
            }

            const dependencies = await getDependencies([this.args.directory, repository], this.logger);
            if (dependencies[this.args.repository.toLowerCase()] === undefined) {
                continue;
            }

            await this.linkRepositoryTo(repository);
        }
    }

    /**
     * Links to this repository in another repository.
     *
     * @param repository   Repository to link to this one.
     * @returns A Promise for creating a symlink.
     */
    private async linkRepositoryTo(repository: string): Promise<void> {
        const sourceModules = await ensurePathExists(this.args.directory, repository, "node_modules");

        const source = path.join(sourceModules, this.args.repository);
        const destination = path.join(this.args.directory, this.args.repository);

        await fs.symlink(destination, source, "dir");
    }
}
