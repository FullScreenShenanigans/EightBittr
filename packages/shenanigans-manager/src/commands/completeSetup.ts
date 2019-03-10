import chalk from "chalk";
import { buildOrder } from "package-build-order";
import * as path from "path";

import { ensureArgsExist, ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { ensurePathExists, resolvePackagePaths } from "../utils";

import { CloneRepository } from "./cloneRepository";
import { CompleteBuild } from "./completeBuild";
import { Exec } from "./exec";
import { InstallGlobalDependencies } from "./installGlobalDependencies";

/**
 * Arguments for a CompleteRepository command.
 */
export interface ICompleteRepositoryArgs extends ICommandArgs {
    /**
     * "repository=organization" pairs of organization overrides.
     */
    fork?: string | string[];
}

/**
 * Parses forks settings into overrides for child repository clones.
 *
 * @param forks   "repository=organization" pairs of organization overrides.
 * @returns An object keying repositories to organization overrides.
 */
const parseForks = (forks: string | string[]): { [i: string]: string } => {
    if (typeof forks === "string") {
        forks = [forks];
    }

    const overrides: { [i: string]: string } = {};

    for (const pair of forks) {
        const [repository, fork] = pair.split("=");

        overrides[repository.toLowerCase()] = fork;
    }

    return overrides;
};

/**
 * Clones, links, installs, and builds all repositories locally.
 */
export const CompleteSetup = async (runtime: IRuntime, args: ICompleteRepositoryArgs) => {
    ensureArgsExist(args, "directory");
    await ensurePathExists(args.directory);

    const logTitle = (message: string): void => {
        runtime.logger.log(chalk.bold(message));
    };

    runtime.logger.log(chalk.greenBright.bold(`Setting shenanigans up in ${path.resolve(args.directory)}.`));
    runtime.logger.log("Hold tight; this might take a few minutes...\n");

    logTitle("1: Installing global development dependencies...");
    await InstallGlobalDependencies(runtime, args);

    const forks = parseForks(args.fork || []);

    logTitle("2: Cloning repositories...");
    for (const repository of runtime.settings.allRepositories) {
        await ensurePathExists(args.directory, repository);
        await CloneRepository(runtime, {
            directory: args.directory,
            fork: repository in forks
                ? runtime.settings.organization
                : forks[repository],
            repository,
        });
    }

    logTitle("3: Installing and linking repositories...");
    const order = await buildOrder({
        paths: resolvePackagePaths(args.directory, runtime.settings.allRepositories),
    });

    for (const repository of order) {
        await Exec(runtime, {
            directory: args.directory,
            repository,
            spawn: "npm install --link",
        });
    }

    logTitle("4: Building the world...");
    await CompleteBuild(runtime, args);

    logTitle("Complete!");
};
