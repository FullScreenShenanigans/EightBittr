define(["AudioPlayr"], function (AudioPlayrModule) {
    var AudioPlayr = AudioPlayrModule.AudioPlayr;

    var mocks = {
        /**
         * 
         */
        mockAudioPlayr: function (settings) {
            return new AudioPlayr(settings)
        }
    };

    return mocks;
});
