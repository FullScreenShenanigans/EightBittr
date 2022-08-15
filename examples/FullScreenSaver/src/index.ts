import { UserWrappr } from "userwrappr";
export * from "./FullScreenSaver";

import { createUserWrapprSettings } from "./interface/InterfaceSettings";

/**
 * Creates a UserWrappr interface around a new FullScreenSaver game.
 *
 * @param container   HTML element to create within.
 */
export const createFullScreenSaverInterface = async (container: HTMLElement): Promise<void> => {
    return new UserWrappr(createUserWrapprSettings()).createDisplay(container);
};
