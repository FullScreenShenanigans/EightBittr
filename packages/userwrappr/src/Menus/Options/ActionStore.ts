import { IActionSchema } from "./OptionSchemas";
import { OptionStore } from "./OptionStore";

/**
 * Store for an option that just calls an action.
 */
export class ActionStore extends OptionStore<IActionSchema> {
    /**
     * Activates the option's action.
     */
    public activate = (): void => {
        this.schema.action();
    };
}
