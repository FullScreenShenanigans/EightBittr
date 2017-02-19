import { Command, ICommandArgs } from "../command";
import { CloneRepository } from "./cloneRepository";

/**
 * Arguments for a CloneAllRepositories command.
 */
export interface ICloneAllRepositoriesArgs extends ICommandArgs {
    /**
     * Whether to also install repository dependencies.
     */
    install?: boolean;
}

/**
 * Clones all repositories locally.
 */
export class CloneAllRepositories extends Command<ICloneAllRepositoriesArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                CloneRepository,
                {
                    ...this.args,
                    repository,
                });
        }
    }
}
