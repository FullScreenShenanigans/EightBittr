import { INumberMakr, INumberMakrSettings } from "../../src/INumberMakr";
import { NumberMakr } from "../../src/NumberMakr";

/**
 * @param settings   Settings for the NumberMakr.
 * @returns An NumberMakr instance.
 */
export function mockNumberMakr(settings?: INumberMakrSettings): INumberMakr {
    return new NumberMakr(settings);
}
