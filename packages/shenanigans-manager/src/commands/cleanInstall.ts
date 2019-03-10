import chalk from "chalk";
import * as fs from "mz/fs";
import * as path from "path";
import * as rimraf from "rimraf";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

import { Exec } from "./exec";

/**
 * Deletes and then regenerates a repository's package-lock.json and node_modules.
 */
export const CleanInstall = async (runtime: IRuntime, args: IRepositoryCommandArgs): Promise<void> => {
    defaultPathArgs(args, "directory", "repository");

    const baseDir = path.join(args.directory, args.repository);
    runtime.logger.log(chalk.grey(`Deleting node_modules and package-lock.json from ${baseDir}`));

    const packageLock = path.join(baseDir, "package-lock.json");
    const nodeModules = path.join(baseDir, "node_modules");

    if (await fs.exists(packageLock)) {
        await fs.unlink(packageLock);
    }

    await new Promise<void>((resolve) => {
        rimraf(
            nodeModules,
            (): void => {
                resolve();
            });
    });

    await Exec(runtime, {
        ...args,
        spawn: "npm install",
    });
};
