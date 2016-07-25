/// <reference path="../../lib/GroupHoldr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockGroupHoldr: (settings?: GroupHoldr.IGroupHoldrSettings): GroupHoldr.IGroupHoldr => {
        return new GroupHoldr.GroupHoldr(settings);
    }
};
