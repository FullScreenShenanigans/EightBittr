/// <reference path="../../lib/ScenePlayr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockScenePlayr: (settings?: ScenePlayr.IScenePlayrSettings): ScenePlayr.IScenePlayr => {
        return new ScenePlayr.ScenePlayr(settings);
    }
};
