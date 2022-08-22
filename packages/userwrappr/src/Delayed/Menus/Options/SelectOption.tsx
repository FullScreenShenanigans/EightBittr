import { useVisualContext } from "../../../VisualContext";
import { LabeledOption } from "./LabeledOption";
import { SelectSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const SelectOption: OptionComponent<SelectSchema> = ({ option }) => {
    const { styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);

    const selectStyle = {
        ...styles.input,
        ...styles.inputSelect,
    };

    return (
        <LabeledOption title={option.title}>
            <select
                onChange={(event) => setValue((event.target as HTMLSelectElement).value)}
                style={selectStyle}
                value={value}
            >
                {option.options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </LabeledOption>
    );
};
