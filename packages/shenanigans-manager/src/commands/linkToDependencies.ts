import chalk from "chalk";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";
import { getDependencyNamesAndExternalsOfPackage } from "../utils";

/**
 * Links a repository to its local dependencies.
 */
export const LinkToDependencies = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const shell: Shell = new Shell(runtime.logger)
        .setCwd(args.directory, args.repository);
    const packagePath = path.join(args.directory, args.repository, "package.json");

    const { dependencyNames } = await getDependencyNamesAndExternalsOfPackage(packagePath);

    runtime.logger.log([
        chalk.grey("Linking"),
        args.repository,
        chalk.grey("to"),
        `[${dependencyNames.join(chalk.grey(", "))}]`,
        chalk.grey("using"),
        packagePath,
    ].join(" "));

    await shell.execute("npm link shenanigans-manager");

    for (const dependency of dependencyNames) {
        await shell.execute(`npm link ${dependency}`);
    }

    runtime.logger.log("\n");
};
