import { IThing } from "./IThing";

/**
 * Settings to initialize a new IPreThing.
 */
export interface IPreThingSettings {
    /**
     * The horizontal starting location of the Thing (by default, 0).
     */
    x?: number;

    /**
     * The vertical starting location of the Thing (by default, 0).
     */
    y?: number;

    /**
     * How wide the Thing is (by default, the Thing's prototype's width from
     * ObjectMaker.getFullPropertiesOf).
     */
    width?: number;

    /**
     * How tall the Thing is (by default, the Thing's prototype's height from
     * ObjectMaker.getFullPropertiesOf).
     */
    height?: number;

    /**
     * An optional immediate modifier instruction for where the Thing should be
     * in its GroupHoldr group (either "beginning", "end", or undefined).
     */
    position?: string;

    /**
     * PreThings may pass any settings onto their created Things.
     */
    [i: string]: any;
}

/**
 * A position holder around an in-game Thing.
 */
export interface IPreThing {
    /**
     * The in-game Thing.
     */
    thing: IThing;

    /**
     * What type the Thing is.
     */
    title: any;

    /**
     * The raw JSON-friendly settings that created this.
     */
    reference: IPreThingSettings;

    /**
     * Whether the Thing has been placed in the container Map.
     */
    spawned: boolean;

    /**
     * The top edge of the Thing's bounding box.
     */
    top: number;

    /**
     * The right edge of the Thing's bounding box.
     */
    right: number;

    /**
     * The bottom edge of the Thing's bounding box.
     */
    bottom: number;

    /**
     * The left edge of the Thing's bounding box.
     */
    left: number;

    /**
     * What part of the in-game container group to move this to, if needed.
     */
    position?: string;
}
