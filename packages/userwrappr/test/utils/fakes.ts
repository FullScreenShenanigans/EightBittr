import { IUserWrappr, IUserWrapprSettings } from "../../src/IUserWrappr";
import { UserWrappr } from "../../src/UserWrappr";

/**
 * 
 */
export function mockUserWrappr(settings: IUserWrapprSettings): IUserWrappr {
    return new UserWrappr(settings);
}
