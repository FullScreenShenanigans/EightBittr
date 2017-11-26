import { IOptionSchema } from "./Options/OptionSchemas";

/**
 * Schema for a menu containing options.
 */
export interface IMenuSchema {
    /**
     * Options within the menu.
     */
    options: IOptionSchema[];

    /**
     * Identifying menu title.
     */
    title: string;
}
