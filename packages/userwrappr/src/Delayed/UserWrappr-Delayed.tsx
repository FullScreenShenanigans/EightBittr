import { render } from "preact";

import { VisualContext, VisualContextType } from "../VisualContext";
import { Buttons, ButtonsProps } from "./Buttons";
import { Menus, MenusProps } from "./Menus";

/**
 * Global scope to check for device settings in, most commonly window.
 */
export interface GameWindow {
    /**
     * Exists if the device appears to support touch.
     */
    ontouchstart?: unknown;
}

/**
 * Dependencies to create a wrapping view in an element.
 */
export interface WrappingViewDependencies extends ButtonsProps, MenusProps, VisualContextType {
    /**
     * Element to create a view within.
     */
    container: HTMLElement;

    /**
     * Global scope to check for device settings in, most commonly window.
     */
    gameWindow: GameWindow;
}

/**
 * Creates a menus view in a container.
 *
 * @param container   Container to create a view within.
 * @param schema   Descriptions of menu options.
 */
export type InitializeUserWrapprDelayedView = (dependencies: WrappingViewDependencies) => void;

/**
 * Module containing initializeUserWrapprDelayed.
 *
 * @remarks This should match the module naming of this file.
 */
export interface InitializeUserWrapprDelayedWrapper {
    /**
     * Creates a menus view in a container.
     */
    initializeUserWrapprDelayed: InitializeUserWrapprDelayedView;
}

/**
 * Creates a menus view in a container.
 *
 * @param dependencies   Dependencies to create the menus view.
 * @returns A Promise for creating a menus view in the container.
 */
export const initializeUserWrapprDelayed: InitializeUserWrapprDelayedView = (dependencies) => {
    const menusContainerQuery = `.${dependencies.classNames.menusOuterArea}`;
    const menusContainer = dependencies.container.querySelector(menusContainerQuery);
    if (menusContainer === null) {
        throw new Error(`Could not find menus container under '${menusContainerQuery}'.`);
    }

    render(
        <VisualContext.Provider value={dependencies}>
            <Menus menus={dependencies.menus} />
            {"ontouchstart" in dependencies.gameWindow ? (
                <Buttons buttons={dependencies.buttons} />
            ) : null}
        </VisualContext.Provider>,
        menusContainer
    );
};
