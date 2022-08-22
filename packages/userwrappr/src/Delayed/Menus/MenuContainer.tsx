import * as Preact from "preact";

import { useVisualContext } from "../../VisualContext";
import { useMenuContext } from "./MenuContext";
import { MenuTitle } from "./MenuTitle";

export interface MenuContainerProps {
    children: Preact.ComponentChild;
}

export const MenuContainer = ({ children }: MenuContainerProps) => {
    const { open } = useMenuContext();
    const { classNames, styles } = useVisualContext();
    const className = `${classNames.menu} ${classNames.menu}-${open ? "open" : "closed"}`;

    return (
        <div className={className} style={styles.menu}>
            <MenuTitle />
            <div
                className={classNames.menuChildren}
                style={open ? styles.menuChildrenOpen : styles.menuChildrenClosed}
            >
                {open ? children : undefined}
            </div>
        </div>
    );
};
