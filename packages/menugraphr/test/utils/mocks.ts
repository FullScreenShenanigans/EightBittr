import { IMenuGraphr, IMenuGraphrSettings } from "../../src/IMenuGraphr";
import { MenuGraphr } from "../../src/MenuGraphr";


export const mocks = {
    /**
     * 
     */
    mockMenuGraphr: (settings?: IMenuGraphrSettings): IMenuGraphr => {
        return new MenuGraphr(settings);
    }
};
