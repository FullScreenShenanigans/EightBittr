import * as Preact from "preact";

import { convertTitleToId } from "../../convertTitleToId";
import { useVisualContext } from "../../VisualContext";
import { useMenuContext } from "../MenuContext";

export interface LabeledOptionProps {
    children: Preact.ComponentChildren;
    title: string;
}

export const LabeledOption = ({ children, title }: LabeledOptionProps) => {
    const { id: menuId } = useMenuContext();
    const { classNames, styles } = useVisualContext();
    const id = convertTitleToId(`${menuId}-${title}`);

    return (
        <>
            <label className={classNames.optionLeft} for={id} style={styles.optionLeft}>
                {title}
            </label>
            <div
                className={classNames.optionRight}
                id={id}
                style={styles.optionRight}
                role="menuitem"
            >
                {children}
            </div>
        </>
    );
};
