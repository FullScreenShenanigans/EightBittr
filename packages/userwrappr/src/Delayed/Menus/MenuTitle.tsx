import { useVisualContext } from "../../VisualContext";
import { useMenuContext } from "./MenuContext";

export const MenuTitle = () => {
    const { id, menu, toggleOpen } = useMenuContext();
    const { classNames, styles } = useVisualContext();

    return (
        <h2 className={classNames.menuTitle} style={styles.menuTitle}>
            <button
                aria-controls={id}
                aria-haspopup="true"
                className={classNames.menuTitleButton}
                id={`${id}-menubutton`}
                onClick={toggleOpen}
                role="button"
                style={styles.menuTitleButton}
            >
                {menu.title}
            </button>
        </h2>
    );
};
