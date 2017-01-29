import { Command } from "../command";
import { RunGulpIn } from "./runGulpIn";

/**
 * Runs Gulp in multiple repositories.
 */
export class RunGulpInAll extends Command<{}, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                RunGulpIn,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
