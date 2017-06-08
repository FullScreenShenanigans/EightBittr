import { ITouchPassr, ITouchPassrSettings } from "../../src/ITouchPassr";
import { TouchPassr } from "../../src/TouchPassr";

/**
 *
 */
export function stubTouchPassr(settings: ITouchPassrSettings): ITouchPassr {
    return new TouchPassr(settings);
}
