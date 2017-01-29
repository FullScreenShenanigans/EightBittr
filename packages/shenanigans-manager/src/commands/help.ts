import "color";

import { Command, ICommandArgs } from "../command";

/**
 * Displays help info.
 */
export class Help extends Command<ICommandArgs, void> {
    /**
     * Executes the command.
     * 
     * @returns A Promise for ensuring the repository exists.
     */
    public async execute(): Promise<any> {
        this.logger.log(
            "shenanigans_manager".cyan,
            "manages locally installed FullScreenShenanigans modules for development");
    }
}
