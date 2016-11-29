import { AreaSpawnr } from "../../src/AreaSpawnr";
import { IAreaSpawnr, IAreaSpawnrSettings } from "../../src/IAreaSpawnr";

export const fakes = {
    /**
     * 
     */
    stubAreaSpawnr: (settings: IAreaSpawnrSettings): IAreaSpawnr => {
        return new AreaSpawnr(settings);
    }
};
