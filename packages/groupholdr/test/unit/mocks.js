define(["GroupHoldr"], function (GroupHoldrModule) {
    var GroupHoldr = GroupHoldrModule.GroupHoldr;

    var mocks = {
        /**
         * 
         */
        mockGroupHoldr: function (settings) {
            return new GroupHoldr(settings)
        }
    };

    return mocks;
});
