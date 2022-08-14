import { CommandArgs } from "./command.js";
import { CommandSearcher } from "./commandSearcher.js";
import { Logger } from "./logger.js";

/**
 * Settings to run the shenanigans-manager program.
 */
export interface RunSettings {
    /**
     * Arguments for the command.
     */
    args: CommandArgs;

    /**
     * Reference name for the command.
     */
    commandName: string;

    /**
     * Logs on important events.
     */
    logger: Logger;
}

/**
 * Runs the shenanigans-manager program.
 */
export class Runner {
    /**
     * Searches for Command classes.
     */
    private readonly commandSearcher: CommandSearcher;

    /**
     * Initializes a new instance of the Runner class.
     *
     * @param commandSearcher   Searches for Command classes.
     */
    public constructor(commandSearcher: CommandSearcher) {
        this.commandSearcher = commandSearcher;
    }

    /**
     * Runs the program.
     *
     * @param runSettings   Settings to run the program.
     * @returns Whether the requested command was run.
     */
    public async run(runSettings: RunSettings) {
        const command = await this.commandSearcher.search(runSettings.commandName);
        if (!command) {
            return false;
        }

        await command(
            {
                logger: runSettings.logger,
            },
            runSettings.args
        );

        return true;
    }
}
