import { useVisualContext } from "../../VisualContext";
import { SelectSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const SelectOption: OptionComponent<SelectSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);

    const selectStyle = {
        ...styles.input,
        ...styles.inputSelect,
    };

    return (
        <div className={classNames.option} style={styles.option}>
            <div className={classNames.optionLeft} style={styles.optionLeft}>
                {option.title}
            </div>
            <div className={classNames.optionRight} style={styles.optionRight}>
                <select
                    onChange={(event) => setValue((event.target as HTMLSelectElement).value)}
                    style={selectStyle}
                    value={value}
                >
                    {option.options.map(
                        (option: string): JSX.Element => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        )
                    )}
                </select>
            </div>
        </div>
    );
};
