import { BrowserClock, createClock, LolexClock } from "lolex";

import { IMenuStoreDependencies, MenuStore } from "../../../src/Menus/MenuStore";
import { stubClassNames, stubStyles } from "../../UserWrappr/stubs";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const fullDependencies = {
        classNames: stubClassNames,
        styles: stubStyles,
        title: "abc",
        ...dependencies
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};
