import { ensureArgsExist, IRepositoryCommandArgs } from "../command";
import { IRuntime } from "../runtime";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a TslintFix command.
 */
export interface ITslintFixArgs extends IRepositoryCommandArgs {
    /**
     * Whether to linting run without the type checker.
     */
    "disable-type-check"?: boolean;
}

const generateLintCommand = (directory: string, disableTypeCheck?: boolean): string => {
    const command = "tslint --config ./tslint.json --fix";

    return disableTypeCheck === true
        ? command
        : `${command} --project ./${directory}tsconfig.json`;
};

/**
 * Runs tslint --fix in a repository.
 */
export const TslintFix = async (runtime: IRuntime, args: ITslintFixArgs) => {
    ensureArgsExist(args, "directory", "repository");

    await EnsureRepositoryExists(runtime, args);

    const shell = new Shell(runtime.logger, args.directory, args.repository);
    const disableTypeCheck = args["disable-type-check"];

    await Promise.all([
        shell.execute(generateLintCommand("", disableTypeCheck)),
        shell.execute(generateLintCommand("test/", disableTypeCheck)),
    ]);
};
