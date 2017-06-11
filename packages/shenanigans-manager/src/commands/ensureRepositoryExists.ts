import { Command, ICommandArgs } from "../command";
import { CloneRepository } from "./cloneRepository";
import { DoesRepositoryExist } from "./doesRepositoryExist";

/**
 * Arguments for an EnsureRepositoryExists command.
 */
export interface IEnsureRepositoryExistsArgs extends ICommandArgs {
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
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        if (!(await this.subroutine(DoesRepositoryExist, this.args))) {
            await this.subroutine(CloneRepository, this.args);
        }
    }
}
