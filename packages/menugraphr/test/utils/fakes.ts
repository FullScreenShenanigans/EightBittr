import { IMenuGraphr, IMenuGraphrSettings } from "../../src/IMenuGraphr";
import { MenuGraphr } from "../../src/MenuGraphr";

/**
 *
 */
export function stubMenuGraphr(settings: IMenuGraphrSettings): IMenuGraphr {
    return new MenuGraphr(settings);
}
