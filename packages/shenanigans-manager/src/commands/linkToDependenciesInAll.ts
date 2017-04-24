import { Command, ICommandArgs } from "../command";
import { LinkToDependencies } from "./linkToDependencies";

/**
 * Links all repositories locally.
 */
export class LinkToDependenciesInAll extends Command<ICommandArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for running the command.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                LinkToDependencies,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
