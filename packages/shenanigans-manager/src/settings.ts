/**
 * Settings to run the manager.
 */
export interface ISettings {
    /**
     * All managed repositories under the FullScreenShenanigans organizations.
     */
    allRepositories: string[];

    /**
     * Local directory containing code repositories.
     */
    codeDir: string;
}

/**
 * User settings to run the manager.
 */
export const settings: ISettings = {
    allRepositories: [
        // Modules
        "AreaSpawnr",
        "AudioPlayr",
        "BattleMovr",
        "ChangeLinr",
        "DeviceLayr",
        "EightBittr",
        "FPSAnalyzr",
        "GamesRunnr",
        "GameStartr",
        "GroupHoldr",
        "InputWritr",
        "ItemsHoldr",
        "MapsCreatr",
        "MapScreenr",
        "MenuGraphr",
        "ModAttachr",
        "NumberMakr",
        "ObjectMakr",
        "PixelDrawr",
        "PixelRendr",
        "QuadsKeepr",
        "ScenePlayr",
        "StateHoldr",
        "StringFilr",
        "ThingHittr",
        "TimeHandlr",
        "TouchPassr",
        "UserWrappr",
        "WorldSeedr",
        // Games
        "FullScreenPokemon"
    ],

    codeDir: "C:/Code/Shenanigans"
};
