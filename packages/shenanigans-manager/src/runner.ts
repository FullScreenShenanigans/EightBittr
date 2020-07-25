import { CommandSearcher } from "./commandSearcher";
import { Logger } from "./logger";
import { Runtime } from "./runtime";

/**
 * Settings to run the shenanigans-manager program.
 */
export interface RunSettings {
    /**
     * Arguments for the command.
     */
    args: any;

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
    public async run(runSettings: RunSettings): Promise<boolean> {
        const command = await this.commandSearcher.search(runSettings.commandName);
        if (!command) {
            return false;
        }

        const runtime: Runtime = {
            logger: runSettings.logger,
        };

        await command(runtime, runSettings.args);

        return true;
    }
}
