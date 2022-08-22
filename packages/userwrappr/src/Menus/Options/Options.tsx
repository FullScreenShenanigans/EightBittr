import { useVisualContext } from "../../VisualContext";
import { useMenuContext } from "../MenuContext";
import { ActionOption } from "./ActionOption";
import { BooleanOption } from "./BooleanOption";
import { LinkOption } from "./LinkOption";
import { MultiSelectOption } from "./MultiSelectOption";
import { NumberOption } from "./NumberOption";
import { OptionSchema, OptionType } from "./OptionSchemas";
import { SelectOption } from "./SelectOption";
import { StringOption } from "./StringOption";
import { OptionComponent } from "./types";

const storeComponents = new Map<OptionType, OptionComponent>([
    [OptionType.Action, ActionOption],
    [OptionType.Boolean, BooleanOption],
    [OptionType.MultiSelect, MultiSelectOption],
    [OptionType.Number, NumberOption],
    [OptionType.Link, LinkOption],
    [OptionType.Select, SelectOption],
    [OptionType.String, StringOption],
]);

export const Options = () => {
    const { id, menu } = useMenuContext();
    const { classNames, containerSize, styles } = useVisualContext();

    return (
        <div className={classNames.options} style={styles.options}>
            <ul
                aria-labelledby={`${id}-menubutton`}
                className={classNames.optionsList}
                id={id}
                role="menu"
                style={{
                    ...styles.optionsList,
                    maxHeight: containerSize.height,
                }}
            >
                {menu.options.map((option: OptionSchema) => {
                    const Component = storeComponents.get(option.type);

                    if (!Component) {
                        throw new Error(`Unknown option type: ${option.type}`);
                    }

                    return (
                        <li
                            className={classNames.option}
                            style={styles.option}
                            role="presentation"
                        >
                            <Component key={option.title} option={option} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};
