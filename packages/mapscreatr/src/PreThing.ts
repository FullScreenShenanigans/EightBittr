/// <reference path="../typings/ObjectMakr.d.ts" />

import { IPreThing, IPreThingSettings } from "./IPreThing";
import { IThing } from "./IThing";

/**
 * Basic storage container for a single Thing to be stored in an Area.
 */
export class PreThing implements IPreThing {
    /**
     * The contained Thing to be placed during gameplay.
     */
    public thing: IThing;

    /**
     * A copy of the Thing's title.
     */
    public title: any;

    /**
     * The creation command used to create the Thing.
     */
    public reference: any;

    /**
     * Whether this PreThing has already spawned (initially false).
     */
    public spawned: boolean;

    /**
     * The top edge of the Thing's bounding box.
     */
    public top: number;

    /**
     * The right edge of the Thing's bounding box.
     */
    public right: number;

    /**
     * The bottom edge of the Thing's bounding box.
     */
    public bottom: number;

    /**
     * The left edge of the Thing's bounding box.
     */
    public left: number;

    /**
     * An optional modifier instruction for group placement, from reference.
     */
    public position: string;

    /**
     * @param {Thing} thing   The Thing, freshly created by ObjectMaker.make.
     * @param {IPreThingSettings} reference   The creation Object instruction 
     *                                        used to create the Thing.
     */
    constructor(thing: IThing, reference: IPreThingSettings, ObjectMaker: ObjectMakr.IObjectMakr) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;

        this.left = reference.x || 0;
        this.top = reference.y || 0;

        this.right = this.left + (reference.width || ObjectMaker.getFullPropertiesOf(this.title).width);
        this.bottom = this.top + (reference.height || ObjectMaker.getFullPropertiesOf(this.title).height);

        if (reference.position) {
            this.position = reference.position;
        }
    }
}
