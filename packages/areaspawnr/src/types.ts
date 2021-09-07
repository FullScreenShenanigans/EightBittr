import { MapsCreatr, PreActorLike, PreActorSettings } from "mapscreatr";
import { MapScreenr } from "mapscreenr";

/**
 * Adds a map command, such as an after or stretch.
 *
 * @param actor   The raw command to create an Actor, as either a title
 *                or a JSON object.
 * @param index   Which command this is, as per Array.forEach.
 * @param commands   All commands in the group.
 */
export type CommandAdder = (
    actor: string | PreActorSettings,
    index: number,
    commands: any[]
) => void;

/**
 * Settings to initialize a new AreaSpawnr.
 */
export interface AreaSpawnrSettings {
    /**
     * MapsCreatr used to store and lazily initialize Maps.
     */
    mapsCreatr: MapsCreatr;

    /**
     * MapScreenr used to store attributes of Areas.
     */
    mapScreenr: MapScreenr;

    /**
     * Function for when a PreActor's Actor should be spawned.
     */
    onSpawn?(preactor: PreActorLike): void;

    /**
     * Function for when a PreActor's Actor should be un-spawned.
     */
    onUnspawn?(preactor: PreActorLike): void;

    /**
     * Any property names to copy from Areas to the MapScreenr during setLocation.
     */
    screenAttributes?: string[];

    /**
     * Function to add an Area's provided "stretches" commands to stretch
     * across an Area.
     */
    stretchAdd?: CommandAdder;

    /**
     * Function to add an Area provides an "afters" command to add PreActors
     * to the end of an Area.
     */
    afterAdd?: CommandAdder;
}
