import { ITimeHandlr, ITimeHandlrSettings } from "../../src/ITimeHandlr";
import { TimeHandlr } from "../../src/TimeHandlr";

/**
 * 
 */
export function mockTimeHandlr(settings: ITimeHandlrSettings): ITimeHandlr {
    return new TimeHandlr(settings);
}
