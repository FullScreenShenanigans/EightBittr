import * as sinon from "sinon";

import { stubClassNames, stubStyles } from "../../fakes.test";

import { ActionStore } from "./ActionStore";
import { OptionType } from "./OptionSchemas";
import { SaveableStore } from "./SaveableStore";

export const stubActionStore = () => {
    const action = sinon.spy();
    const title = "action store";
    const type = OptionType.Action;
    const store = new ActionStore({
        classNames: stubClassNames,
        schema: { action, title, type },
        styles: stubStyles,
    });

    return { action, store };
};

export const stubSaveableStore = () => {
    const initialValue = "abc";
    const getInitialValue = () => initialValue;
    const title = "saveable store";
    const type = OptionType.Boolean;
    const saveValue = sinon.spy();
    const store = new SaveableStore({
        classNames: stubClassNames,
        schema: { getInitialValue, title, type, saveValue },
        styles: stubStyles,
    });

    return { getInitialValue, title, saveValue, store };
};
