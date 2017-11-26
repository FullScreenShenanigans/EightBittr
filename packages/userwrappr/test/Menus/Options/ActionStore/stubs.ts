import * as sinon from "sinon";

import { ActionStore } from "../../../../src/Menus/Options/ActionStore";
import { OptionType } from "../../../../src/Menus/Options/OptionSchemas";
import { stubClassNames, stubStyles } from "../../../UserWrappr/stubs";

export const stubActionStore = () => {
    const action = sinon.spy();
    const title = "action store";
    const type = OptionType.Action;
    const store = new ActionStore({
        classNames: stubClassNames,
        schema: { action, title, type },
        styles: stubStyles
    });

    return { action, store };
};
