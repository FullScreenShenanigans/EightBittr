import { GameStartr } from "../../src/GameStartr";
import { Graphics } from "../../src/Graphics";
import { Gameplay } from "../../src/Gameplay";
import { IGameStartrSettings, IModuleSettings } from "../../src/IGameStartr";
import { Maps } from "../../src/Maps";
import { Physics } from "../../src/Physics";
import { Scrolling } from "../../src/Scrolling";
import { Things } from "../../src/Things";
import { Utilities } from "../../src/Utilities";

/**
 * Stub subclass of the Maps component.
 */
export class StubMaps extends Maps<StubGameStartr> {
    /**
     * Pretends to set the location.
     */
    public setLocation(): void { }

    /**
     * Pretends to set the map.
     */
    public setMap(): void { }
}

/**
 * Stub subclass of GameStartr.
 */
export class StubGameStartr extends GameStartr {
    /**
     * Stub settings for individual modules.
     */
    public static moduleSettings: IModuleSettings = {
        audio: {
            directory: "sounds",
            fileTypes: ["mp3"],
            library: {}
        },
        collisions: {
            globalCheckGenerators: {},
            hitCheckGenerators: {},
            hitCallbackGenerators: {}
        },
        devices: {},
        generator: {
            possibilities: {}
        },
        groups: {
            groupNames: [],
            groupTypes: {}
        },
        events: { },
        input: {
            triggers: {}
        },
        maps: {
            groupTypes: [],
            mapDefault: "map",
            locationDefault: "location",
            macros: {},
            entrances: {},
            library: {}
        },
        math: {},
        mods: {
            mods: []
        },
        objects: {
            inheritance: {}
        },
        quadrants: {
            numRows: 1,
            numCols: 1,
            groupNames: []
        },
        renderer: {
            groupNames: []
        },
        runner: {
            games: []
        },
        scenes: {},
        sprites: {
            paletteDefault: [
                [0, 0, 0, 0]
            ]
        },
        items: { },
        touch: {}
    };

    /**
     * Stub settings for individual modules.
     */
    public moduleSettings: IModuleSettings;

    /**
     * Sets the system components.
     */
    protected resetComponents(): void {
        this.gameplay = new Gameplay(this);
        this.graphics = new Graphics(this);
        this.maps = new StubMaps(this);
        this.physics = new Physics(this);
        this.scrolling = new Scrolling(this);
        this.things = new Things(this);
        this.utilities = new Utilities(this);
    }

    /**
     * Sets the system modules.
     * 
     * @param settings   Any additional settings.
     */
    protected resetModules(settings: IGameStartrSettings): void {
        this.moduleSettings = StubGameStartr.moduleSettings;
        super.resetModules(settings);
    }
}

export function stubGameStartr(): StubGameStartr {
    return new StubGameStartr({
        width: 256,
        height: 256
    });
}
