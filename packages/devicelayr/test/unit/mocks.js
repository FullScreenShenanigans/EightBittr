define(["DeviceLayr"], function (DeviceLayrModule) {
    var DeviceLayr = DeviceLayrModule.DeviceLayr;

    var mocks = {
        /**
         * 
         */
        mockDeviceLayr: function (settings) {
            return new DeviceLayr(settings)
        }
    };

    return mocks;
});
