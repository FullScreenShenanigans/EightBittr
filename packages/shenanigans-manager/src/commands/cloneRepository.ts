import { Command, ICommandArgs } from "../command";
import { Shell } from "../shell";

/**
 * Arguments for a CloneRepository command.
 */
export interface ICloneRepositoryArgs extends ICommandArgs {
    /**
     * Whether to also install the repository's dependencies.
     */
    install?: boolean;

    /**
     * Whether to also link this in npm.
     */
    link?: boolean;

    /**
     * Name of the repository.
     */
    repository: string;
}

/**
 * Clones a repository locally.
 */
export class CloneRepository extends Command<ICloneRepositoryArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        this.ensureArgsExist("directory", "repository");

        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.args.directory)
            .execute(`git clone https://github.com/FullScreenShenanigans/${this.args.repository}`);

        if (this.args.install) {
            await shell
                .setCwd(this.args.directory, this.args.repository)
                .execute("npm install --silent");
        }

        if (this.args.link) {
            await shell
                .setCwd(this.args.directory, this.args.repository)
                .execute("npm link");
        }
    }
}
