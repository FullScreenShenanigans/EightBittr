/**
 * Settings to run the manager.
 */
export interface ISettings {
    /**
     * All managed repositories under the organization.
     */
    allRepositories: string[];

    /**
     * Organization to clone repositories from.
     */
    organization: string;
}

/**
 * User settings to run the manager.
 */
export const settings: ISettings = {
    allRepositories: [
        // Modules
        "areaspawnr",
        "audioplayr",
        "battlemovr",
        "changelinr",
        "devicelayr",
        "eightbittr",
        "flagswappr",
        "fpsanalyzr",
        "gamesrunnr",
        "gamestartr",
        "groupholdr",
        "inputwritr",
        "itemsholdr",
        "mapscreatr",
        "mapscreenr",
        "menugraphr",
        "modattachr",
        "numbermakr",
        "objectmakr",
        "pixeldrawr",
        "pixelrendr",
        "quadskeepr",
        "sceneplayr",
        "stateholdr",
        "stringfilr",
        "thinghittr",
        "timehandlr",
        "touchpassr",
        "userwrappr",
        "worldseedr",
        // Games
        "fullscreenpokemon",
    ],
    organization: "FullScreenShenanigans",
};
