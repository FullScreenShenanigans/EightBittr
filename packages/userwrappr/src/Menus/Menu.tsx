import { useState } from "preact/hooks";

import { MenuSchema } from "..";
import { convertTitleToId } from "../convertTitleToId";
import { MenuContainer } from "./MenuContainer";
import { MenuContext } from "./MenuContext";
import { Options } from "./Options/Options";

export interface MenuProps {
    menu: MenuSchema;
}

export const Menu = ({ menu }: MenuProps) => {
    const [open, setOpen] = useState(false);
    const id = convertTitleToId(menu.title);

    return (
        <MenuContext.Provider value={{ id, menu, open, toggleOpen: () => setOpen(!open) }}>
            <MenuContainer>
                <Options />
            </MenuContainer>
        </MenuContext.Provider>
    );
};
