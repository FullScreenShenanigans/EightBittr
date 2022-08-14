import * as React from "react";

import { useVisualContext } from "../../VisualContext";
import { MultiSelectSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

function ofLength<T>(length: number, create: (i: number) => T) {
    const results: T[] = [];

    for (let i = 0; i < length; i += 1) {
        results.push(create(i));
    }

    return results;
}

function replaceIndex<T>(array: T[], index: number, replacement: T) {
    const clone = array.slice();
    clone[index] = replacement;
    return clone;
}

export const MultiSelectOption: OptionComponent<MultiSelectSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);

    return (
        <div className={classNames.option} style={styles.option}>
            <div className={classNames.optionLeft} style={styles.optionLeft}>
                {option.title}
            </div>
            <div className={classNames.optionRight} style={styles.optionRight}>
                {ofLength(option.selections, (index) => {
                    const selectStyle = {
                        ...styles.input,
                        ...styles.inputSelect,
                    };

                    return (
                        <select
                            key={index}
                            onChange={(event) => {
                                console.log({ value, index }, event.target.value);
                                setValue(replaceIndex(value, index, event.target.value));
                            }}
                            value={value[index]}
                            style={selectStyle}
                        >
                            {option.options.map((option) => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    );
                })}
            </div>
        </div>
    );
};
