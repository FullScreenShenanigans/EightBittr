import { Command, ICommandArgs } from "../command";
import { RunGulpSetupIn } from "./runGulpSetupIn";

/**
 * Runs gulp-setup in multiple repositories.
 */
export class RunGulpSetupInAll extends Command<ICommandArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                RunGulpSetupIn,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
