import { FPSAnalyzr } from "../../src/FPSAnalyzr";
import { IFPSAnalyzr, IFPSAnalyzrSettings } from "../../src/IFPSAnalyzr";

/**
 * 
 */
export function mockFPSAnalyzr(settings?: IFPSAnalyzrSettings): IFPSAnalyzr {
    return new FPSAnalyzr(settings)
}
