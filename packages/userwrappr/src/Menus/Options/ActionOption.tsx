import { observer } from "mobx-react";
import * as React from "react";

import { ActionStore } from "./ActionStore";

export const ActionOption = observer(({ store }: { store: ActionStore }) => {
    const style: React.CSSProperties = {
        ...store.styles.inputButton,
        ...store.styles.inputButtonOn,
        ...store.styles.inputButtonAction,
    } as React.CSSProperties;

    return (
        <div
            className={store.classNames.option}
            style={store.styles.option as React.CSSProperties}
        >
            <button name={store.schema.title} onClick={store.activate} style={style}>
                {store.schema.title}
            </button>
        </div>
    );
});
