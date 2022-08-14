import * as React from "react";
import * as ReactDOM from "react-dom";

import { Menus } from "./Menus";
import { MenusStore, MenusStoreDependencies } from "./MenusStore";

/**
 * Dependencies to create a wrapping view in an element.
 */
export interface WrappingViewDependencies extends MenusStoreDependencies {
    /**
     * Element to create a view within.
     */
    container: HTMLElement;
}

/**
 * Creates a menus view in a container.
 *
 * @param container   Container to create a view within.
 * @param schema   Descriptions of menu options.
 */
export type InitializeMenusView = (dependencies: WrappingViewDependencies) => Promise<void>;

/**
 * Module containing initializeMenus.
 *
 * @remarks This should match the module naming of this file.
 */
export interface InitializeMenusViewWrapper {
    /**
     * Creates a menus view in a container.
     */
    initializeMenus: InitializeMenusView;
}

/**
 * Creates a menus view in a container.
 *
 * @param dependencies   Dependencies to create the menus view.
 * @returns A Promise for creating a menus view in the container.
 */
export const initializeMenus: InitializeMenusView = async (
    dependencies: WrappingViewDependencies
): Promise<void> => {
    const store = new MenusStore({
        classNames: dependencies.classNames,
        containerSize: dependencies.containerSize,
        menus: dependencies.menus,
        styles: dependencies.styles,
    });

    const menusContainerQuery = `.${dependencies.classNames.menusOuterArea}`;
    const menusContainer = dependencies.container.querySelector(menusContainerQuery);
    if (menusContainer === null) {
        throw new Error(`Could not find menus container under '${menusContainerQuery}'.`);
    }

    await new Promise<void>((resolve) => {
        ReactDOM.render(<Menus store={store} />, menusContainer, resolve);
    });
};
