import { Logger } from "./logger.js";

/**
 * Static settings to define a runtime.
 */
export interface Runtime {
    /**
     * Logs on important events.
     */
    logger: Logger;
}
