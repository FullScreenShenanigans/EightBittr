import { IMapsCreatr, IMapsCreatrSettings } from "../../src/IMapsCreatr";
import { MapsCreatr } from "../../src/MapsCreatr";

export const fakes = {
    /**
     *
     */
    stubMapsCreatr: (settings: IMapsCreatrSettings): IMapsCreatr => {
        return new MapsCreatr(settings);
    }
};
