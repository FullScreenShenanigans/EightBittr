require("gulp-shenanigans").initialize({
    dependencies: [
        "AreaSpawnr",
        "AudioPlayr",
        "DeviceLayr",
        "EightBittr",
        "FPSAnalyzr",
        "GamesRunnr",
        "GroupHoldr",
        "InputWritr",
        "ItemsHoldr",
        "LevelEditr",
        "MapsCreatr",
        "MathDecidr",
        "ModAttachr",
        "NumberMakr",
        "ObjectMakr",
        "PixelDrawr",
        "PixelRendr",
        "QuadsKeepr",
        "ScenePlayr",
        "ThingHittr",
        "TimeHandlr",
        "TouchPassr",
        "UserWrappr",
        "WorldSeedr"
    ],
    externals: [
        {
            file: "node_modules/js-beautify/js/lib/beautify",
            typing: "js-beautify"
        }
    ],
    gulp: require("gulp"),
    packageName: "GameStartr"
});
