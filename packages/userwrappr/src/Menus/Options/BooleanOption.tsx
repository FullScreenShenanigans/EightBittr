import * as React from "react";

import { useVisualContext } from "../../VisualContext";
import { BooleanSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const BooleanOption: OptionComponent<BooleanSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);
    const descriptor = value ? "on" : "off";

    return (
        <div className={classNames.option} style={styles.option}>
            <div className={classNames.optionLeft} style={styles.optionLeft}>
                {option.title}
            </div>
            <div className={classNames.optionRight} style={styles.optionRight}>
                <button
                    onClick={() => setValue(!value)}
                    style={{
                        ...styles.inputButton,
                        ...styles.inputButtonBoolean,
                        ...(value ? styles.inputButtonOn : styles.inputButtonOff),
                    }}
                    type="button"
                >
                    {descriptor}
                </button>
            </div>
        </div>
    );
};
