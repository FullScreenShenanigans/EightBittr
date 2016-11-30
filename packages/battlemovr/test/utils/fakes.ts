import { BattleMovr } from "../../src/BattleMovr";
import { IBattleMovr, IBattleMovrSettings } from "../../src/IBattleMovr";

/**
 * 
 */
export function stubBattleMovr(settings: IBattleMovrSettings): IBattleMovr{
    return new BattleMovr(settings);
}
