import { Command } from "../command";
import { CreateRepository } from "./createRepository";
import { DoesRepositoryExist } from "./doesRepositoryExist";

/**
 * Arguments for an EnsureRepositoryExists command.
 */
export interface IEnsureRepositoryExistsArgs {
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
export class EnsureRepositoryExists extends Command<IEnsureRepositoryExistsArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(args: IEnsureRepositoryExistsArgs): Promise<any> {
        if (!(await Command.execute(this.logger, DoesRepositoryExist, args))) {
            await Command.execute(this.logger, CreateRepository, args);
        }
    }
}
