import { useVisualContext } from "../../VisualContext";
import { NumberSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const NumberOption: OptionComponent<NumberSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);

    return (
        <div className={classNames.option} style={styles.option}>
            <div className={classNames.optionLeft} style={styles.optionLeft}>
                {option.title}
            </div>
            <div className={classNames.optionRight} style={styles.optionRight}>
                <input
                    max={option.maximum}
                    min={option.minimum}
                    onChange={(event) => {
                        setValue((event.target as HTMLInputElement).valueAsNumber);
                    }}
                    style={styles.input}
                    type="number"
                    value={value}
                />
            </div>
        </div>
    );
};
