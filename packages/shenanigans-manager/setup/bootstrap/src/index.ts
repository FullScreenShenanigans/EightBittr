{{ #shenanigans.game }}
import { UserWrappr } from "userwrappr";
{{ /shenanigans.game }}
export * from "./{{ shenanigans.name }}";
{{ ^shenanigans.game }}
export * from "./types";
{{ /shenanigans.game }}


{{ #shenanigans.game }}
import { createUserWrapprSettings } from "./interface/InterfaceSettings";

/**
 * Creates a UserWrappr interface around a new {{ shenanigans.name }} game.
 *
 * @param container   HTML element to create within.
 */
export const create{{ shenanigans.name }}Interface = async (container: HTMLElement): Promise<void> =>
    new UserWrappr(createUserWrapprSettings())
        .createDisplay(container);
{{ /shenanigans.game }}
