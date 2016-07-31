/// <reference path="../../lib/UserWrappr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockUserWrappr: (settings: UserWrappr.IUserWrapprSettings = mocks.mockUserWrapprSettings): UserWrappr.IUserWrappr => {
        return new UserWrappr.UserWrappr(settings);
    }
};
