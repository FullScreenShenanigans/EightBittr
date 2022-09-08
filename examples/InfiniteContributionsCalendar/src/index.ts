import { UserWrappr } from "userwrappr";
export * from "./InfiniteContributionsCalendar";

import { createUserWrapprSettings } from "./interface/InterfaceSettings";

/**
 * Creates a UserWrappr interface around a new FullScreenSaver game.
 *
 * @param container   HTML element to create within.
 */
export const createInfiniteContributionsCalendarInterface = async (
    container: HTMLElement
): Promise<void> => {
    return new UserWrappr(createUserWrapprSettings()).createDisplay(container);
};
