import chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Exec } from "./exec";
import { HydratePackageJson } from "./hydratePackageJson";

/**
 * Prepares a repository to be managed by shenanigans-manager.
 */
export const BootstrapRepository = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    for (const directory of [".vscode", "src", "test"]) {
        const directoryPath = path.join(args.directory, args.repository, directory);

        if (!(await fs.exists(directoryPath))) {
            runtime.logger.log(chalk.grey(`Creating directory ${directoryPath}`));
            await fs.mkdir(directoryPath);
        }
    }

    await HydratePackageJson(runtime, args);
    await Exec(runtime, {
        ...args,
        exec: "npm link shenanigans-manager",
    });
    await Exec(runtime, {
        ...args,
        exec: "npm run setup",
    });
};
