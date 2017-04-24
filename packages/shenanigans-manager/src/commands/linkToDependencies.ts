import * as fs from "mz/fs";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";

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
 * Links a repository to its dependencies.
 */
export class LinkToDependencies extends Command<ILinkToDependenciesArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        const shell: Shell = new Shell(this.logger);
        await shell.setCwd(this.args.directory, this.args.repository);
        await shell.execute(`npm link ${Array.from(await this.getDependencies()).join(" ")}`);
    }

    /**
     * Retrieves the shenanigans package dependencies for a package.
     * 
     * @returns The package's shenanigans package dependencies.
     */
    private async getDependencies(): Promise<Set<string>> {
        const packageFilePath: string = path.join(this.args.directory, this.args.repository, "package.json");
        let packages: string[];

        try {
            const contents: string = (await fs.readFile(packageFilePath)).toString();
            packages = Object.keys(JSON.parse(contents).dependencies || []);
        } catch (error) {
            this.logger.log(`Could not retrieve package info for ${this.args.repository}...`);
            packages = [];
        }

        return new Set([
            ...packages,
            "gulp-shenanigans"
        ]);
    }
}
