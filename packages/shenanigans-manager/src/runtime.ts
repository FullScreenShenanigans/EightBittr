import { Logger } from "./logger";

/**
 * Static settings to define a runtime.
 */
export interface Runtime {
    /**
     * Logs on important events.
     */
    logger: Logger;
}
