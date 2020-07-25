import chalk from "chalk";

import { Runtime } from "./runtime";

/**
 * Common arguments for all commands.
 */
export interface CommandArgs {
    /**
     * Location to run the command in.
     */
    directory: string;
}

/**
 * Args for a command that targets a single repository.
 */
export interface RepositoryCommandArgs extends CommandArgs {
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
export type Command<TArgs extends CommandArgs = CommandArgs, TReturn = void> = (
    runtime: Runtime,
    args: TArgs
) => Promise<TReturn>;

/**
 * Throws an error if any required arguments don't exist.
 *
 * @template TArgs   Type of the arguments.
 * @param args   User-provided arguments.
 * @param names   Names of required arguments.
 */
export const ensureArgsExist = <TArgs extends {}>(
    args: TArgs,
    ...names: (keyof TArgs)[]
): void => {
    const missing = names.filter((name) => !(name in args));
    if (!missing.length) {
        return;
    }

    throw new Error(
        chalk.red(
            [
                `Missing arg${missing.length === 1 ? "" : "s"}:`,
                chalk.bold(missing.join(" ")),
            ].join(" ")
        )
    );
};

/**
 * Defaults a set of arguments to ".".
 *
 * @template TArgs   Type of the arguments.
 * @param args   User-provided arguments.
 * @param names   Argument names to default.
 */
export const defaultPathArgs = <TArgs extends CommandArgs>(
    args: TArgs,
    ...names: (keyof TArgs)[]
): void => {
    for (const name of names) {
        if (!(name in args)) {
            (args as any)[name] = ".";
        }
    }
};
