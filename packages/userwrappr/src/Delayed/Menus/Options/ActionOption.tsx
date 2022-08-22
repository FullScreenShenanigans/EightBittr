import { useVisualContext } from "../../../VisualContext";
import { ActionSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";

export const ActionOption: OptionComponent<ActionSchema> = ({ option }) => {
    const { styles } = useVisualContext();

    return (
        <button
            name={option.title}
            onClick={option.action}
            role="menuitem"
            style={{
                ...styles.inputButton,
                ...styles.inputButtonOn,
                ...styles.inputButtonAction,
            }}
            type="button"
        >
            {option.title}
        </button>
    );
};
