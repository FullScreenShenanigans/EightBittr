import { useVisualContext } from "../../VisualContext";
import { StringSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";
import { useOptionState } from "./useOptionState";

export const StringOption: OptionComponent<StringSchema> = ({ option }) => {
    const { classNames, styles } = useVisualContext();
    const [value, setValue] = useOptionState(option);

    return (
        <div className={classNames.option} style={styles.option}>
            <div className={classNames.optionLeft} style={styles.optionLeft}>
                {option.title}
            </div>
            <div className={classNames.optionRight} style={styles.optionRight}>
                <input
                    onChange={(event) => setValue((event.target as HTMLInputElement).value)}
                    type="string"
                    value={value}
                />
            </div>
        </div>
    );
};
