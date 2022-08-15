import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { MenuSchema } from "..";
import { OpenState } from "./OpenState";

export interface MenuContextType {
    menu: MenuSchema;
    open: OpenState;
    setOpen: (update: (open: OpenState) => OpenState) => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const MenuContext = createContext<MenuContextType>({} as any);

export const useMenuContext = () => useContext(MenuContext);
