import { Command } from "../command";
import { UpdateGulpShenanigansIn } from "./updateGulpShenanigansIn";

/**
 * Creates a repository locally.
 */
export class UpdateGulpShenanigansInAll extends Command<{}, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for executing the command.
     */
    public async execute(): Promise<any> {
        for (const repository of this.settings.allRepositories) {
            await this.subroutine(
                UpdateGulpShenanigansIn,
                {
                    ...this.args,
                    repository
                });
        }
    }
}
