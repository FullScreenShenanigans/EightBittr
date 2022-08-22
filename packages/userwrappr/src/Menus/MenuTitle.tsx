import { useVisualContext } from "../VisualContext";
import { useMenuContext } from "./MenuContext";

export const MenuTitle = () => {
    const { menu, toggleOpen } = useMenuContext();
    const { classNames, styles } = useVisualContext();

    return (
        <h2 className={classNames.menuTitle} style={styles.menuTitle}>
            <button
                className={classNames.menuTitleButton}
                onClick={toggleOpen}
                role="button"
                style={styles.menuTitleButton}
            >
                {menu.title}
            </button>
        </h2>
    );
};
