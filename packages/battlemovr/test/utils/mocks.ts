/// <reference path="../../lib/BattleMovr.d.ts" />

const mocks = {
    /**
     * 
     */
    mockBattleMovr: (settings: BattleMovr.IBattleMovrSettings): BattleMovr.IBattleMovr => {
        return new BattleMovr.BattleMovr(settings);
    }
};
