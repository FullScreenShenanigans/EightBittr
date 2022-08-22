import { useVisualContext } from "../VisualContext";
import { Menu } from "./Menu";
import { MenuSchema } from "./MenuSchemas";

export interface MenusProps {
    /**
     * Menu schemas to render.
     */
    menus: MenuSchema[];
}

export const Menus = ({ menus }: MenusProps) => {
    const { classNames, containerSize, styles } = useVisualContext();

    return (
        <div
            className={classNames.menusInnerArea}
            style={{
                ...styles.menusInnerArea,
                width: `${containerSize.width}px`,
            }}
        >
            {menus.map((menu) => (
                <Menu key={menu.title} menu={menu} />
            ))}
        </div>
    );
};
