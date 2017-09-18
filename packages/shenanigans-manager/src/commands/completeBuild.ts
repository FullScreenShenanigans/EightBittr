import * as chalk from "chalk";
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
        const order = await buildOrder({
            paths: this.resolvePackagePaths(this.settings.allRepositories)
        });

        this.logger.log(
            chalk.grey.italic("Building in order:"),
            chalk.green(order.join(" ")),
            "\n");

        for (const packageToBuild of order) {
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
            packagePaths[repositoryName] = path.join(this.args.directory, repositoryName, "package.json");
        }

        return packagePaths;
    }
}
