import * as chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { ensurePathExists } from "../utils";

/**
 * Arguments for a CloneRepository command.
 */
export interface ICloneRepositoryArgs extends ICommandArgs {
    /**
     * Whether to also link this to its dependencies.
     */
    link?: boolean;

    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Clones a repository locally.
 */
export class CloneRepository extends Command<ICloneRepositoryArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.args.directory)
            .execute(`git clone https://github.com/FullScreenShenanigans/${this.args.repository}`);

        if (this.args.link) {
            await this.link();
        }
    }

    private async link(): Promise<void> {
        await this.linkToRepository([], ["gulp-shenanigans"]);
        this.logger.log(chalk.grey("Linking"), this.args.repository, chalk.grey("to its dependencies..."));

        for (const dependency of Object.keys(await this.getDependencies(this.args.repository))) {
            await this.linkToRepository([], dependency.split("/"));
        }

        for (const dependency of Object.keys(await this.getDependencies("gulp-shenanigans"))) {
            await this.linkToRepository(["gulp-shenanigans", "node_modules"], dependency.split("/"));
        }
    }

    private async getDependencies(subDirectory: string): Promise<string[]> {
        const packagePath = path.join(this.args.directory, subDirectory, "package.json");

        try {
            return JSON.parse((await fs.readFile(packagePath)).toString()).dependencies || [];
        } catch (error) {
            this.logger.log(chalk.red("Could not parse", packagePath));
            throw error;
        }
    }

    private async linkToRepository(subDirectory: string[], packageName: string[]): Promise<void> {
        await ensurePathExists(this.args.directory, this.args.repository, "node_modules", ...packageName.slice(0, packageName.length - 1));

        const source = await ensurePathExists(this.args.directory, ...subDirectory, ...packageName);
        const destination = path.join(this.args.directory, this.args.repository, "node_modules", ...packageName);

        await fs.symlink(source, destination, "dir");
    }
}
