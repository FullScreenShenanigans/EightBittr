import * as chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { ensurePathExists, getDependencies } from "../utils";

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

        await this.linkToRepository([], ["gulp-shenanigans"]);
        this.logger.log(chalk.grey("Linking"), this.args.repository, chalk.grey("to its dependencies..."));

        for (const dependency of Object.keys(
            await getDependencies([this.args.directory, this.args.repository], this.logger))
        ) {
            await this.linkToRepository([], dependency.split("/"));
        }

        for (const dependency of Object.keys(
            await getDependencies([this.args.directory, "gulp-shenanigans"], this.logger))
        ) {
            await this.linkToRepository(["gulp-shenanigans", "node_modules"], dependency.split("/"));
        }
    }

    /**
     * Links to a repository under a subdirectory.
     *
     * @param subDirectory   Nested path to create a source link.
     * @param packageName   Package name to link to.
     * @returns A Promise for creating a symlink.
     */
    private async linkToRepository(subDirectory: string[], packageName: string[]): Promise<void> {
        await ensurePathExists(
            this.args.directory,
            this.args.repository,
            "node_modules",
            ...packageName.slice(0, packageName.length - 1));

        const source = await ensurePathExists(this.args.directory, ...subDirectory, ...packageName);
        const destination = path.join(this.args.directory, this.args.repository, "node_modules", ...packageName);

        await fs.symlink(source, destination, "dir");
    }
}
