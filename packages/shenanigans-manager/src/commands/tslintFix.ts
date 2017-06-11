import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for a TslintFix command.
 */
export interface ITslintFixArgs extends ICommandArgs {
    /**
     * Whether to linting run without the type checker.
     */
    "disable-type-check"?: boolean;

    /**
     * Name of the repository.
     */
    repository: string;
}

const generateLintCommand = (directory: string, disableTypeCheck?: boolean): string => {
    const command = `tslint --config ./tslint.json --project ./${directory}tsconfig.json --fix`;

    return disableTypeCheck === true
        ? command
        : `${command} --type-check`;
};

/**
 * Runs TslintFix in a repository.
 */
export class TslintFix extends Command<ITslintFixArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        await this.subroutine(EnsureRepositoryExists, this.args);

        const shell = new Shell(this.logger, this.args.directory, this.args.repository);

        await Promise.all([
            shell.execute(generateLintCommand("", this.args["disable-type-check"])),
            shell.execute(generateLintCommand("test/", this.args["disable-type-check"]))
        ]);
    }
}
