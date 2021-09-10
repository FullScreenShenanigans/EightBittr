import * as React from "react";

import { useVisualContext } from "../VisualContext";
import { Menu } from "./Menu";
import { MenuSchema } from "./MenuSchemas";

export interface MenusProps {
    /**
     * Menu schemas to render.
     */
    menus: MenuSchema[];
}

export const Menus: React.FC<MenusProps> = ({ menus }) => {
    const { classNames, containerSize, styles } = useVisualContext();

    return (
        <div
            className={classNames.menusInnerArea}
            style={{
                ...styles.menusInnerArea,
                width: `${containerSize.width}px`,
            }}
        >
            {menus.map((menu: MenuSchema) => (
                <Menu key={menu.title} menu={menu} />
            ))}
        </div>
    );
};
