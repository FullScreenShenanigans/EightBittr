import * as chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { ensurePathExists } from "../utils";

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

        for (const dependency of Object.keys(await this.getDependencies(this.args.repository))) {
            await this.linkToRepository([], dependency.split("/"));
        }

        for (const dependency of Object.keys(await this.getDependencies("gulp-shenanigans"))) {
            await this.linkToRepository(["gulp-shenanigans", "node_modules"], dependency.split("/"));
        }
    }

    /**
     * Retrieves the dependencies for a repository.
     *
     * @param repository   Repository to get dependencies from.
     * @returns A Promise for the repository's dependencies.
     */
    private async getDependencies(repository: string): Promise<string[]> {
        const packagePath = path.join(this.args.directory, repository, "package.json");

        try {
            return JSON.parse((await fs.readFile(packagePath)).toString()).dependencies || [];
        } catch (error) {
            this.logger.log(chalk.red("Could not parse", packagePath));
            throw error;
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
