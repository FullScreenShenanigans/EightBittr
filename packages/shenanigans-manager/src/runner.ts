import { runCommandInAll } from "./command";
import { ICommandSearcher } from "./commandSearcher";
import { ILogger } from "./logger";
import { IRuntime } from "./runtime";
import { ISettings } from "./settings";

/**
 * Settings to run the shenanigans-manager program.
 */
export interface IRunSettings {
    /**
     * Whether to run the command in all repositories.
     */
    all?: boolean;

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
    logger: ILogger;

    /**
     * User settings for the manager.
     */
    userSettings: ISettings;
}

/**
 * Runs the shenanigans-manager program.
 */
export class Runner {
    /**
     * Searches for Command classes.
     */
    private readonly commandSearcher: ICommandSearcher;

    /**
     * Initializes a new instance of the Runner class.
     *
     * @param commandSearcher   Searches for Command classes.
     */
    public constructor(commandSearcher: ICommandSearcher) {
        this.commandSearcher = commandSearcher;
    }

    /**
     * Runs the program.
     *
     * @param runSettings   Settings to run the program.
     * @returns Whether the requested command was run.
     */
    public async run(runSettings: IRunSettings): Promise<boolean> {
        const command = await this.commandSearcher.search(runSettings.commandName);
        if (!command) {
            return false;
        }

        const runtime: IRuntime = {
            logger: runSettings.logger,
            settings: runSettings.userSettings,
        };

        if (runSettings.all) {
            await runCommandInAll(runtime, command, runSettings.args);
        } else {
            await command(runtime, runSettings.args);
        }

        return true;
    }
}
