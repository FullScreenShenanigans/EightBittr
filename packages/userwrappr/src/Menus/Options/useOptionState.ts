import { useState } from "react";
import { SaveableSchema } from "./OptionSchemas";

export const useOptionState = <Value>(option: SaveableSchema<Value>) => {
    const [value, setValue] = useState(option.getInitialValue());

    return [
        value,
        (newValue: Value) => {
            setValue(newValue);
            option.saveValue(newValue, value);
        },
    ] as const;
};
