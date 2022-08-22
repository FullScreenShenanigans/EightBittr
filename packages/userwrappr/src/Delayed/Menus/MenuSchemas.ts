import { OptionSchema } from "./Options/OptionSchemas";

/**
 * Schema for a menu containing options.
 */
export interface MenuSchema {
    /**
     * Options within the menu.
     */
    options: OptionSchema[];

    /**
     * Identifying menu title.
     */
    title: string;
}
