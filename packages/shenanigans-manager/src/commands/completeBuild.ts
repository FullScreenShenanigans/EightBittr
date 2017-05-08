import { buildOrder, IPackagePaths } from "package-build-order";
import * as path from "path";

import { Command, ICommandArgs } from "../command";
import { Gulp } from "./gulp";

/**
 * Builds all repositories locally.
 */
export class CompleteBuild extends Command<ICommandArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        for (const packageToBuild of await buildOrder(this.resolvePackagePaths(this.settings.allRepositories))) {
            await this.subroutine(Gulp, {
                directory: this.args.directory,
                repository: packageToBuild
            });
        }
    }

    /**
     * Converts repository names to their package paths.
     * 
     * @param repositoryNames   Names of local repositories.
     * @returns Repository names keyed to their package paths.
     */
    private resolvePackagePaths(repositoryNames: string[]): IPackagePaths {
        const packagePaths: IPackagePaths = {};

        for (const repositoryName of repositoryNames) {
            packagePaths[repositoryName] = path.join(this.args.directory, repositoryName);
        }

        return packagePaths;
    }
}
