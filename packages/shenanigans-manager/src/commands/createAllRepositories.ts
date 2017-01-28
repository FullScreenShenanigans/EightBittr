import { Command } from "../command";
import { allRepositories } from "../settings";
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
     * @param args   Arguments for the command.
     * @returns A Promise for creating the repository.
     */
    public async execute(args: ICreateAllRepositoriesArgs): Promise<any> {
        for (const repository of allRepositories) {
            await Command.execute(
                this.logger,
                CreateRepository,
                {
                    repository,
                    ...args
                });
        }
    }
}
