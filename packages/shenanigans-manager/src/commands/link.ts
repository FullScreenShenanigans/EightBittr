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

        const shell: Shell = new Shell(this.logger);
        await shell.setCwd(this.args.directory, this.args.repository);
        await shell.execute("npm link");
    }
}
