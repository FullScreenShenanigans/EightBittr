import chalk from "chalk";
import { buildOrder } from "package-build-order";

import { IRuntime } from "./runtime";
import { resolvePackagePaths } from "./utils";

/**
 * Common arguments for all commands.
 */
export interface ICommandArgs {
    /**
     * Location to run the command in.
     */
    directory: string;
}

/**
 * Args for a command that targets a single repository.
 */
export interface IRepositoryCommandArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Executable management command.
 *
 * @template TArgs   Type of the command's arguments.
 * @template TResults   Type of the returned results.
 */
export type ICommand<TArgs extends ICommandArgs = ICommandArgs, TReturn = void> = (runtime: IRuntime, args: TArgs) => Promise<TReturn>;

/**
 * Attempts to order repositories in their build order.
 *
 * @param directory   Root directory to scan repository directories within.
 * @param repositories   Repository names to order.
 * @returns Repositories in build order, or their original order if an error occurred.
 */
const getRepositoriesInBuildOrder = async (directory: string, repositories: string[], runtime: IRuntime): Promise<string[]> => {
    try {
        return await buildOrder({
            paths: resolvePackagePaths(directory, repositories),
        });
    } catch (error) {
        runtime.logger.log(`Could not determine in-build order: ${error}`);
    }

    return repositories;
};

/**
 * Runs a command in all repositories.
 *
 * @template TArgs   Type of the command's arguments.
 * @template TSubResults   Type the command returns.
 * @param commandClass   Command to run.
 * @param args   Args for the command.
 */
export const runCommandInAll = async <TArgs extends ICommandArgs = ICommandArgs, TReturn = void>
    (runtime: IRuntime, command: ICommand<TArgs, TReturn>, args: TArgs): Promise<TReturn[]> => {
        const fullOrder = await getRepositoriesInBuildOrder(args.directory, runtime.settings.allRepositories, runtime);
        const results: TReturn[] = [];

        runtime.logger.log([
            chalk.grey("Executing in order:"),
            `${chalk.grey("[")}${fullOrder.join(chalk.grey(", "))}${chalk.grey("]")}`,
        ].join(" "));

        for (const repository of fullOrder) {
            const subArgs: TArgs & IRepositoryCommandArgs = {
                ...args as any,
                repository,
            };

            results.push(await command(runtime, subArgs));
        }

        return results;
    };

/**
 * Throws an error if any required arguments don't exist.
 *
 * @template TArgs   Type of the arguments.
 * @param args   User-provided arguments.
 * @param names   Names of required arguments.
 */
export const ensureArgsExist = <TArgs extends {}>
    (args: TArgs, ...names: (keyof TArgs)[]): void => {
        const missing = names.filter((name) => !(name in args));
        if (!missing.length) {
            return;
        }

        throw new Error(
            chalk.red([
                `Missing arg${missing.length === 1 ? "" : "s"}:`,
                chalk.bold(missing.join(" ")),
            ].join(" ")));
    };

/**
 * Defaults a set of arguments to ".".
 *
 * @template TArgs   Type of the arguments.
 * @param args   User-provided arguments.
 * @param names   Argument names to default.
 */
export const defaultPathArgs = <TArgs extends ICommandArgs>
    (args: TArgs, ...names: (keyof TArgs)[]): void => {
        for (const name of names) {
            if (!(name in args)) {
                (args as any)[name] = ".";
            }
        }
    };
