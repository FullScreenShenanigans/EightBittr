import * as sinon from "sinon";

import { OptionType } from "../../../../src/Menus/Options/OptionSchemas";
import { SaveableStore } from "../../../../src/Menus/Options/SaveableStore";
import { stubClassNames, stubStyles } from "../../../UserWrappr/stubs";

export const stubSaveableStore = () => {
    const initialValue = "abc";
    const getInitialValue = () => initialValue;
    const title = "saveable store";
    const type = OptionType.Boolean;
    const saveValue = sinon.spy();
    const store = new SaveableStore({
        classNames: stubClassNames,
        schema: { getInitialValue, title, type, saveValue },
        styles: stubStyles
    });

    return { getInitialValue, title, saveValue, store };
};
