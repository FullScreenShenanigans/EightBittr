import { ICommandSearcher } from "./commandSearcher";
import { ILogger } from "./logger";
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
     * @param settings   Settings to run the program.
     * @returns Whether the requested command was run.
     */
    public async run(settings: IRunSettings): Promise<boolean> {
        const commandClass = await this.commandSearcher.search(settings.commandName);
        if (!commandClass) {
            return false;
        }

        if (settings.all) {
            for (const repository of settings.userSettings.allRepositories) {
                await new commandClass({ ...settings.args, repository }, settings.logger, settings.userSettings)
                    .execute();
            }
        } else {
            await new commandClass(settings.args, settings.logger, settings.userSettings).execute();
        }

        return true;
    }
}
