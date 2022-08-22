import { useVisualContext } from "../../VisualContext";
import { LinkSchema } from "./OptionSchemas";
import { OptionComponent } from "./types";

export const LinkOption: OptionComponent<LinkSchema> = ({ option }) => {
    const { styles } = useVisualContext();

    return (
        <a
            href={option.href}
            name={option.title}
            role="menuitem"
            style={{
                ...styles.inputButton,
                ...styles.inputButtonOn,
                ...styles.inputButtonLink,
            }}
        >
            {option.title}
        </a>
    );
};
