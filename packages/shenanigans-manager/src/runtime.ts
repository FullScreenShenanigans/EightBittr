import { ILogger } from "./logger";

/**
 * Static settings to define a runtime.
 */
export interface IRuntime {
    /**
     * Logs on important events.
     */
    logger: ILogger;
}
