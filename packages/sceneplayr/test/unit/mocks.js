define(["ScenePlayr"], function (ScenePlayrModule) {
    var ScenePlayr = ScenePlayrModule.ScenePlayr;

    var mocks = {
        /**
         * 
         */
        mockScenePlayr: function (settings) {
            return new ScenePlayr(settings)
        }
    };

    return mocks;
});
