import * as React from "react";
import { ActionSchema } from "userwrappr/src";

import { useVisualContext } from "../../VisualContext";
import { OptionComponent } from "./types";

export const ActionOption: OptionComponent<ActionSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();

    return (
        <div className={classNames.option} style={styles.option}>
            <button
                name={option.title}
                onClick={option.action}
                style={{
                    ...styles.inputButton,
                    ...styles.inputButtonOn,
                    ...styles.inputButtonAction,
                }}
                type="button"
            >
                {option.title}
            </button>
        </div>
    );
};
