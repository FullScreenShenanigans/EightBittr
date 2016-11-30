import { IStringFilr, IStringFilrSettings } from "../../src/IStringFilr";
import { StringFilr } from "../../src/StringFilr";

/**
 * @param settings   Settings for the StringFilr.
 * @returns An StringFilr instance.
 */
export function mockStringFilr(settings: IStringFilrSettings<any>): IStringFilr<any> {
    return new StringFilr(settings);
}
