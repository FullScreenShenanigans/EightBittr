import { Command } from "../command";
import { Shell } from "../shell";

/**
 * Arguments for a CreateRepository command.
 */
export interface ICreateRepositoryArgs {
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
 * Creates a repository locally.
 */
export class CreateRepository extends Command<ICreateRepositoryArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for creating the repository.
     */
    public async execute(): Promise<any> {
        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(this.settings.codeDir)
            .execute(`git clone https://github.com/FullScreenShenanigans/${this.args.repository}`);

        if (this.args.install) {
            await shell
                .setCwd(this.settings.codeDir, this.args.repository)
                .execute("npm install");
        }

        if (this.args.link) {
            await shell
                .setCwd(this.settings.codeDir, this.args.repository)
                .execute("npm link");
        }
    }
}
