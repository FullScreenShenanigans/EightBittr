import { Command } from "../command";
import { codeDir } from "../settings";
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
     * @param args   Arguments for the command.
     * @returns A Promise for creating the repository.
     */
    public async execute(args: ICreateRepositoryArgs): Promise<any> {
        const shell: Shell = new Shell(this.logger);

        await shell
            .setCwd(codeDir)
            .execute(`git clone https://github.com/FullScreenShenanigans/${args.repository}`);

        if (args.install) {
            await shell
                .setCwd(codeDir, args.repository)
                .execute("npm install");
        }
    }
}
