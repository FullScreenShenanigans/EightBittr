import { Command } from "../command";
import { Shell } from "../shell";
import { CreateRepository } from "./createRepository";

/**
 * Arguments for a CreateAllRepositories command.
 */
export interface ICreateAllRepositoriesArgs {
    /**
     * Whether to also install repository dependencies.
     */
    install?: boolean;

    /**
     * Whether to also link the repositories together.
     */
    link?: boolean;
}

/**
 * Creates all repositories locally.
 */
export class CreateAllRepositories extends Command<ICreateAllRepositoriesArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                CreateRepository,
                {
                    ...this.args,
                    repository,
                });
        }

        if (!this.args.link) {
            return;
        }

        const shell: Shell = new Shell(this.logger);

        for (const target of this.settings.allRepositories) {
            for (const external of this.settings.allRepositories) {
                if (target === external) {
                    continue;
                }

                await shell
                    .setCwd(this.settings.codeDir, target)
                    .execute(`npm link ${target}`);
            }
        }
    }
}
