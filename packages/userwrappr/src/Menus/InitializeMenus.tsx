import * as React from "react";
import * as ReactDOM from "react-dom";
import { VisualContext, VisualContextType } from "../VisualContext";

import { Menus, MenusProps } from "./Menus";

/**
 * Dependencies to create a wrapping view in an element.
 */
export interface WrappingViewDependencies extends MenusProps, VisualContextType {
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
export const initializeMenus: InitializeMenusView = async (dependencies) => {
    const menusContainerQuery = `.${dependencies.classNames.menusOuterArea}`;
    const menusContainer = dependencies.container.querySelector(menusContainerQuery);
    if (menusContainer === null) {
        throw new Error(`Could not find menus container under '${menusContainerQuery}'.`);
    }

    await new Promise<void>((resolve) => {
        ReactDOM.render(
            <VisualContext.Provider value={dependencies}>
                <Menus menus={dependencies.menus} />
            </VisualContext.Provider>,
            menusContainer,
            resolve
        );
    });
};
