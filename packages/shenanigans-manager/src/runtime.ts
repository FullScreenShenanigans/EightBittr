
import { ILogger } from "./logger";
import { ISettings } from "./settings";

/**
 * Static settings to define a runtime.
 */
export interface IRuntime {
    /**
     * Logs on important events.
     */
    logger: ILogger;

    /**
     * Settings to run the manager.
     */
    settings: ISettings;
}
