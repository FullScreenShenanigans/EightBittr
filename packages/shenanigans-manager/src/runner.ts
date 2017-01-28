import { ICommandClass } from "./command";
import { ICommandSearcher } from "./commandSearcher";
import { ILogger } from "./logger";
import { ISettings } from "./settings";

/**
 * Settings to run the shenanigans-manager program.
 */
export interface IRunSettings {
    /**
     * Arguments for the command.
     */
    args: any;

    /**
     * Reference name for the command.
     */
    command: string;

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
     * @param settings   Settings to run the program.
     * @returns Whether the requested command was run.
     */
    public async run(settings: IRunSettings): Promise<boolean> {
        const command: ICommandClass<any, any> | undefined = this.commandSearcher.search(settings.command);
        if (!command) {
            return false;
        }

        await new command(settings.args, settings.logger, settings.userSettings);
        return true;
    }
}
