import { EightBittr } from "../EightBittr";

import { GeneralComponent } from "./GeneralComponent";

/**
 * Collection settings for IThing group names.
 */
export class Groups<TEightBittr extends EightBittr> extends GeneralComponent<TEightBittr> {
    /**
     * Names of known IThing groups.
     */
    public readonly groupNames?: string[];
}
