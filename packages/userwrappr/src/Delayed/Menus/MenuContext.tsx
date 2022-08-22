import { createContext } from "preact";
import { useContext } from "preact/hooks";

import { MenuSchema } from "../..";

export interface MenuContextType {
    id: string;
    menu: MenuSchema;
    open: boolean;
    toggleOpen: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
export const MenuContext = createContext<MenuContextType>({} as any);

export const useMenuContext = () => useContext(MenuContext);
