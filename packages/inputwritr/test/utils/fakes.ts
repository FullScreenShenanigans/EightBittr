import { IInputWritr, IInputWritrSettings } from "../../src/IInputWritr";
import { InputWritr } from "../../src/InputWritr";

/**
 * 
 */
export function mockInputWritr(settings: IInputWritrSettings): IInputWritr {
    return new InputWritr(settings);
}
