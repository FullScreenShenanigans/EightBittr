import { useVisualContext } from "../VisualContext";
import { useMenuContext } from "./MenuContext";
import { OpenState } from "./OpenState";

export const MenuTitle = () => {
    const { menu, setOpen } = useMenuContext();
    const { classNames, styles } = useVisualContext();

    return (
        <h2
            className={classNames.menuTitle}
            onMouseEnter={() =>
                setOpen((open) => {
                    return open || OpenState.FromHover;
                })
            }
            style={styles.menuTitle}
        >
            <button
                className={classNames.menuTitleButton}
                onClick={() =>
                    setOpen((open) => {
                        return open === OpenState.FromClick
                            ? OpenState.Closed
                            : OpenState.FromClick;
                    })
                }
                role="button"
                style={styles.menuTitleButton}
            >
                {menu.title}
            </button>
        </h2>
    );
};
