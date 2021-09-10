import * as React from "react";

import { useVisualContext } from "../../VisualContext";
import { useMenuContext } from "../MenuContext";
import { OpenState } from "../OpenState";
import { ActionOption } from "./ActionOption";
import { BooleanOption } from "./BooleanOption";
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
    [OptionType.Select, SelectOption],
    [OptionType.String, StringOption],
]);

export const Options = () => {
    const { menu, setOpen } = useMenuContext();
    const { classNames, containerSize, styles } = useVisualContext();

    return (
        <div
            className={classNames.options}
            onMouseLeave={() =>
                setOpen((open) => {
                    return open === OpenState.FromHover ? OpenState.Closed : open;
                })
            }
            style={styles.options}
        >
            <div
                className={classNames.optionsList}
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

                    return <Component key={option.title} option={option} />;
                })}
            </div>
        </div>
    );
};
