import { useState } from "preact/hooks";

import { MenuSchema } from "..";
import { MenuContainer } from "./MenuContainer";
import { MenuContext } from "./MenuContext";
import { OpenState } from "./OpenState";
import { Options } from "./Options/Options";

export interface MenuProps {
    menu: MenuSchema;
}

export const Menu = ({ menu }: MenuProps) => {
    const [open, setOpen] = useState(OpenState.Closed);

    return (
        <MenuContext.Provider value={{ menu, open, setOpen }}>
            <MenuContainer>
                <Options />
            </MenuContainer>
        </MenuContext.Provider>
    );
};
