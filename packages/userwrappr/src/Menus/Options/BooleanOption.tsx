import { useVisualContext } from "../../VisualContext";
import { LabeledOption } from "./LabeledOption";
import { BooleanSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const BooleanOption: OptionComponent<BooleanSchema> = ({ option }) => {
    const { styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);
    const descriptor = value ? "on" : "off";

    return (
        <LabeledOption title={option.title}>
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
        </LabeledOption>
    );
};
