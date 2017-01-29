import { Command, ICommandArgs } from "../command";
import { CreateRepository } from "./createRepository";

/**
 * Arguments for a CreateAllRepositories command.
 */
export interface ICreateAllRepositoriesArgs extends ICommandArgs {
    /**
     * Whether to also install repository dependencies.
     */
    install?: boolean;
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
    }
}
