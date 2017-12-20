import chalk from "chalk";
import { buildOrder, IPackagePaths } from "package-build-order";
import * as path from "path";

import { ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Exec, IExecArgs } from "./exec";

/**
 * Converts repository names to their package paths.
 *
 * @param repositoryNames   Names of local repositories.
 * @returns Repository names keyed to their package paths.
 */
const resolvePackagePaths = (directory: string, repositoryNames: string[]): IPackagePaths => {
    const packagePaths: IPackagePaths = {};

    for (const repositoryName of repositoryNames) {
        packagePaths[repositoryName] = path.join(directory, repositoryName, "package.json");
    }

    return packagePaths;
};

/**
 * Builds all repositories locally.
 */
export const CompleteBuild = async (runtime: IRuntime, args: ICommandArgs) => {
    const order = await buildOrder({
        paths: resolvePackagePaths(args.directory, runtime.settings.allRepositories),
    });

    runtime.logger.log([
        chalk.grey.italic("Building in order:"),
        chalk.green(order.join(" ")),
        "\n",
    ].join(" "));

    for (const packageToBuild of order) {
        const subArgs: IExecArgs = {
            directory: args.directory,
            exec: "npm run setup && npm run verify",
            repository: packageToBuild,
        };

        const code = await Exec(runtime, subArgs);

        if (code !== 0) {
            runtime.logger.log(`\n${chalk.red("Aborting build.")}`);
            return;
        }
    }
};
