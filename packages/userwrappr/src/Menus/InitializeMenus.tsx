import { render } from "preact";

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
export type InitializeMenusView = (dependencies: WrappingViewDependencies) => void;

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
export const initializeMenus: InitializeMenusView = (dependencies) => {
    const menusContainerQuery = `.${dependencies.classNames.menusOuterArea}`;
    const menusContainer = dependencies.container.querySelector(menusContainerQuery);
    if (menusContainer === null) {
        throw new Error(`Could not find menus container under '${menusContainerQuery}'.`);
    }

    render(
        <VisualContext.Provider value={dependencies}>
            <Menus menus={dependencies.menus} />
        </VisualContext.Provider>,
        menusContainer
    );
};
