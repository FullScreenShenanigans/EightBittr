import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for an OpenOnGithub command.
 */
export interface IOpenOnGithubArgs extends ICommandArgs {
    /**
     * Suffix to append to the URL.
     */
    url?: string;

    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Runs OpenOnGithub in a repository.
 */
export class OpenOnGithub extends Command<IOpenOnGithubArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("repository");

        await this.subroutine(EnsureRepositoryExists, this.args);

        const url = [
            "https://github.com",
            this.settings.organization,
            this.args.repository,
            this.args.url === undefined
                ? ""
                : this.args.url
        ].join("/");
        const shell = new Shell(this.logger, this.args.directory, this.args.repository);

        await shell.execute(`start ${url}`);
    }
}
