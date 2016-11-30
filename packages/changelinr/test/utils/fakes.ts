import { ChangeLinr } from "../../src/ChangeLinr";
import { IChangeLinr, IChangeLinrSettings } from "../../src/IChangeLinr";

/**
 * 
 */
export function mockChangeLinr(settings: IChangeLinrSettings): IChangeLinr {
    return new ChangeLinr(settings);
}
