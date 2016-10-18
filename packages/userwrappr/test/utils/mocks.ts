import { IUserWrappr, IUserWrapprSettings } from "../../src/IUserWrappr";
import { UserWrappr } from "../../src/UserWrappr";

export const mocks = {
    /**
     * 
     */
    mockUserWrappr: (settings: IUserWrapprSettings = mocks.mockUserWrapprSettings()): IUserWrappr => {
        return new UserWrappr(settings);
    },

    mockUserWrapprSettings: (): IUserWrapprSettings => {
        return {} as any;
    }
};
