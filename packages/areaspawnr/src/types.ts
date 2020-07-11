import { MapsCreatr, IPreThing, IPreThingSettings } from "mapscreatr";
import { MapScreenr } from "mapscreenr";

/**
 * A Function to add a map command, such as an after or stretch.
 *
 * @param thing   The raw command to create a Thing, as either a title
 *                or a JSON object.
 * @param index   Which command this is, as per Array.forEach.
 * @param commands   All commands in the group.
 */
export type ICommandAdder = (
    thing: string | IPreThingSettings,
    index: number,
    commands: any[]
) => void;

/**
 * Settings to initialize a new AreaSpawnr.
 */
export interface IAreaSpawnrSettings {
    /**
     * MapsCreatr used to store and lazily initialize Maps.
     */
    mapsCreatr: MapsCreatr;

    /**
     * MapScreenr used to store attributes of Areas.
     */
    mapScreenr: MapScreenr;

    /**
     * Function for when a PreThing's Thing should be spawned.
     */
    onSpawn?(prething: IPreThing): void;

    /**
     * Function for when a PreThing's Thing should be un-spawned.
     */
    onUnspawn?(prething: IPreThing): void;

    /**
     * Any property names to copy from Areas to the MapScreenr during setLocation.
     */
    screenAttributes?: string[];

    /**
     * Function to add an Area's provided "stretches" commands to stretch
     * across an Area.
     */
    stretchAdd?: ICommandAdder;

    /**
     * Function to add an Area provides an "afters" command to add PreThings
     * to the end of an Area.
     */
    afterAdd?: ICommandAdder;
}
