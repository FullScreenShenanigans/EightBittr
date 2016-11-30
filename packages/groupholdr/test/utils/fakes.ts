import { GroupHoldr } from "../../src/GroupHoldr";
import { IGroupHoldr, IGroupHoldrSettings } from "../../src/IGroupHoldr";

/**
 * 
 */
export function mockGroupHoldr(settings: IGroupHoldrSettings): IGroupHoldr {
    return new GroupHoldr(settings);
}
