import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";

/**
 * Arguments for a Link command.
 */
export interface ILinkArgs extends ICommandArgs {
    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Links a repository globally.
 */
export class Link extends Command<ILinkArgs, void> {
    /**
     * Executes the command.
     *
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        await new Shell(this.logger)
            .setCwd(this.args.directory, this.args.repository)
            .execute("npm link");
    }
}
