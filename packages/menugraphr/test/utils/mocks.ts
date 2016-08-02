/// <reference path="../../lib/MenuGraphr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockMenuGraphr: (settings: MenuGraphr.IMenuGraphrSettings): MenuGraphr.IMenuGraphr => {
        return new MenuGraphr.MenuGraphr(settings);
    }
};
