import chalk from "chalk";
import { buildOrder, IPackagePaths } from "package-build-order";
import * as path from "path";

import { ensureArgsExist, ICommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { ensurePathExists } from "../utils";
import { CloneRepository } from "./cloneRepository";
import { CompleteBuild } from "./completeBuild";
import { Exec, IExecArgs } from "./exec";
import { LinkToDependencies } from "./linkToDependencies";

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

    runtime.logger.log(chalk.greenBright.bold(`Setting shenanigans up in ${args.directory}.`));
    runtime.logger.log("Hold tight; this might take a few minutes...\n");

    const forks = parseForks(args.fork || []);

    for (const repository of runtime.settings.allRepositories) {
        await ensurePathExists(args.directory, repository);
        await CloneRepository(runtime, {
            directory: args.directory,
            fork: forks[repository] === undefined
                ? runtime.settings.organization
                : forks[repository],
            repository,
        });

        await Exec(runtime, {
            directory: args.directory,
            exec: "npm install && npm link",
            repository,
        });
    }

    for (const repository of runtime.settings.allRepositories) {
        await LinkToDependencies(runtime, {
            directory: args.directory,
            repository,
        });
    }

    await CompleteBuild(runtime, args);
};
