import { MapScreenr } from "../../src/MapScreenr";
import { IMapScreenr, IMapScreenrSettings } from "../../src/IMapScreenr";

export const fakes = {
    /**
     * 
     */
    stubMapScreenr: (settings?: IMapScreenrSettings): IMapScreenr => {
        return new MapScreenr(settings || {
            width: 256,
            height: 256
        });
    }
};
