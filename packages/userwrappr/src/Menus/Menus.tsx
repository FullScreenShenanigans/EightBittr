import { observer } from "mobx-react";
import * as React from "react";

import { Menu } from "./Menu";
import { MenuAndOptionsListStores, MenusStore } from "./MenusStore";
import { Options } from "./Options/Options";

const renderMenuAndOptionsList = (stores: MenuAndOptionsListStores) => (
    <Menu key={stores.menu.titleStore.title} store={stores.menu}>
        <Options store={stores.options} />
    </Menu>
);

export const Menus = observer(({ store }: { store: MenusStore }) => {
    const style = {
        ...store.styles.menusInnerArea,
        width: `${store.containerSize.width}px`,
    } as React.CSSProperties;

    return (
        <div className={store.classNames.menusInnerArea} style={style}>
            {store.menuAndOptionListStores.map(renderMenuAndOptionsList)}
        </div>
    );
});
