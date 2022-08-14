import { Actor as ActorHittrActor, ActorHittrSettings } from "actorhittr";
import { AreaSpawnrSettings } from "areaspawnr";
import { FpsAnalyzrSettings } from "fpsanalyzr";
import { FrameTickrSettings } from "frametickr";
import { Actor as GroupHoldrActor, GroupHoldrSettings } from "groupholdr";
import { InputWritrSettings } from "inputwritr";
import { ItemsHoldrSettings } from "itemsholdr";
import {
    Actor as MapsCreatrActor,
    AreaRaw as MapsCreatrAreaRaw,
    MapRaw as MapsCreatrMapRaw,
    MapsCreatrSettings,
} from "mapscreatr";
import { MapScreenrSettings } from "mapscreenr";
import { ObjectMakrSettings } from "objectmakr";
import { Actor as PixelDrawrActor, PixelDrawrSettings } from "pixeldrawr";
import { PixelRendrSettings } from "pixelrendr";
import { Actor as QuadsKeeprActor, Quadrant, QuadsKeeprSettings } from "quadskeepr";
import { TimeHandlrSettings } from "timehandlr";

/**
 * Settings to initialize a new EightBittr.
 */
export interface EightBittrConstructorSettings {
    /**
     * Component settings overrides.
     */
    components?: Partial<ComponentSettings>;

    /**
     * How many pixels tall the game area should be.
     */
    height: number;

    /**
     * How many pixels wide the game area should be.
     */
    width: number;
}

/**
 * Filled-out settings to initialize a new EightBittr.
 */
export type EightBittrSettings = Required<EightBittrConstructorSettings>;

/**
 * Settings to generate components.
 */
export interface ComponentSettings {
    /**
     * Settings overrides for the game's AreaSpawnr.
     */
    areaSpawner?: Partial<AreaSpawnrSettings>;

    /**
     * Settings overrides for the game's FpsAnalyzr.
     */
    fpsAnalyzer?: Partial<FpsAnalyzrSettings>;

    /**
     * Settings overrides for the game's FrameTickr.
     */
    frameTicker?: Partial<FrameTickrSettings>;

    /**
     * Settings overrides for the game's GroupHoldr.
     */
    groupHolder?: Partial<GroupHoldrSettings<Record<string, Actor>>>;

    /**
     * Settings overrides for the game's InputWritr.
     */
    inputWriter?: Partial<InputWritrSettings>;

    /**
     * Settings overrides for the game's ItemsHoldr.
     */
    itemsHolder?: Partial<ItemsHoldrSettings>;

    /**
     * Settings overrides for the game's MapsCreatr.
     */
    mapsCreator?: Partial<MapsCreatrSettings>;

    /**
     * Settings overrides for the game's MapScreenr.
     */
    mapScreener?: Partial<MapScreenrSettings>;

    /**
     * Settings overrides for the game's ObjectMakr.
     */
    objectMaker?: Partial<ObjectMakrSettings>;

    /**
     * Settings overrides for the game's PixelDrawr.
     */
    pixelDrawer?: Partial<PixelDrawrSettings>;

    /**
     * Settings overrides for the game's PixelRendr.
     */
    pixelRender?: Partial<PixelRendrSettings>;

    /**
     * Settings overrides for the game's QuadsKeepr.
     */
    quadsKeeper?: Partial<QuadsKeeprSettings>;

    /**
     * Settings overrides for the game's TimeHandlr.
     */
    timeHandler?: Partial<TimeHandlrSettings>;

    /**
     * Settings overrides for the game's ActorHittr.
     */
    actorHitter?: Partial<ActorHittrSettings>;
}

export interface GameWindow {
    /**
     * Adds an event listener to the window.
     */
    addEventListener: typeof window.addEventListener;

    /**
     * Reference to the window document.
     */
    document: {
        /**
         * Adds an event listener to the document.
         */
        addEventListener: typeof document.addEventListener;
    };

    /**
     * Removes an event listener from the window.
     */
    removeEventListener: typeof window.removeEventListener;
}

/**
 * A raw JSON-friendly description of a map.
 */
export interface MapRaw extends MapsCreatrMapRaw {
    /**
     * A default location to spawn into.
     */
    locationDefault: number | string;

    /**
     * Descriptions of areas within the map.
     */
    areas: Record<string, AreaRaw>;
}

/**
 * A raw JSON-friendly description of a map area.
 */
export interface AreaRaw extends MapsCreatrAreaRaw {
    /**
     * A background color for the area, if not the default for the setting.
     */
    background?: string;
}

/**
 * A standard in-game actor, with size, velocity, position, and other information.
 */
export interface Actor
    extends GroupHoldrActor,
        MapsCreatrActor,
        PixelDrawrActor,
        QuadsKeeprActor,
        ActorHittrActor {
    /**
     * A summary of this Actor's current visual representation.
     */
    className: string;

    /**
     * How rapidly this is moving horizontally.
     */
    xVelocity: number;

    /**
     * How rapidly this is moving vertically.
     */
    yVelocity: number;

    /**
     * The maximum number of quadrants this can be a part of, based on size.
     */
    maximumQuadrants: number;

    /**
     * An additional name to add to the Actor's .className.
     */
    name?: string;

    /**
     * Whether this has been placed into the game.
     */
    placed?: boolean;

    /**
     * Whether this should be excluded from the game.
     */
    removed?: boolean;

    /**
     * A storage container for Quadrants this Actor may be in.
     */
    quadrants: Quadrant<this>[];

    /**
     * What to call when this is added to the active pool of Actors (during
     * actorProcess), before sizing is set.
     */
    onActorMake?(actor: this): void;

    /**
     * What to call when this is added to the active pool of Actors.
     */
    onActorAdded?(actor: this): void;

    /**
     * What to call when this is deleted from its Actors group.
     */
    onDelete?(actor: this): void;
}
