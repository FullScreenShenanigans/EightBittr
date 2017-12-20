import chalk from "chalk";

import { IRuntime } from "./runtime";

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
 * Runs a command in all repositories.
 *
 * @template TArgs   Type of the command's arguments.
 * @template TSubResults   Type the command returns.
 * @param commandClass   Command to run.
 * @param args   Args for the command.
 */
export const runCommandInAll = async <TArgs extends ICommandArgs = ICommandArgs, TReturn = void>
    (runtime: IRuntime, command: ICommand<TArgs, TReturn>, args: TArgs): Promise<TReturn[]> => {
        const results: TReturn[] = [];

        for (const repository of runtime.settings.allRepositories) {
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
export const defaultPathArgs = <TArgs extends {}>
    (args: TArgs, ...names: (keyof TArgs)[]): void => {
        for (const name of names) {
            if (!(name in args)) {
                args[name] = ".";
            }
        }
    };
