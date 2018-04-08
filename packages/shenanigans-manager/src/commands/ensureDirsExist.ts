import chalk from "chalk";
import * as mkdirp from "mkdirp";
import * as path from "path";

import { defaultPathArgs, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";

const defaultDirectories = [".github", ".vscode", "coverage", "dist", "docs", "instrumented", "src", "test"];

/**
 * Ensures directories needed for setup exist.
 */
export const EnsureDirsExist = async (runtime: IRuntime, args: IRepositoryCommandArgs) => {
    defaultPathArgs(args, "directory", "repository");

    const promises: Promise<void>[] = [];

    for (const directory of defaultDirectories) {
        const directoryPath = path.join(args.directory, args.repository, directory);

        console.log([
            chalk.grey("Ensuring"),
            chalk.grey.bold(directoryPath),
            chalk.grey("exists."),
        ].join(" "));

        promises.push(new Promise((resolve, reject) => {
            mkdirp(
                directoryPath,
                (error): void => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
        }));
    }

    await Promise.all(promises);
};
