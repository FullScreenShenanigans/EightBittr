import { Command } from "../command";
import { EnsureRepositoryExists } from "./ensureRepositoryExists";

/**
 * Arguments for an EnsureAllRepositoriesExist command.
 */
export interface IEnsureAllRepositoriesExistArgs {
    /**
     * Whether to also install the repository's dependencies.
     */
    install?: boolean;
}

/**
 * Ensures all repositories exist.
 */
export class EnsureAllRepositoriesExist extends Command<IEnsureAllRepositoriesExistArgs, void> {
    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                EnsureRepositoryExists,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
