import { IObjectMakr } from "objectmakr";

import { IPreThing, IPreThingSettings } from "./IPreThing";
import { IThing } from "./IThing";

/**
 * Basic storage container for a single Thing to be stored in an Area.
 */
export class PreThing implements IPreThing {
    /**
     * The contained Thing to be placed during gameplay.
     */
    public readonly thing: IThing;

    /**
     * A copy of the Thing's title.
     */
    public readonly title: string;

    /**
     * The creation command used to create the Thing.
     */
    public readonly reference: any;

    /**
     * Whether this PreThing has already spawned (initially false).
     */
    public readonly spawned: boolean;

    /**
     * The top edge of the Thing's bounding box.
     */
    public readonly top: number;

    /**
     * The right edge of the Thing's bounding box.
     */
    public readonly right: number;

    /**
     * The bottom edge of the Thing's bounding box.
     */
    public readonly bottom: number;

    /**
     * The left edge of the Thing's bounding box.
     */
    public readonly left: number;

    /**
     * An optional modifier instruction for group placement, from reference.
     */
    public readonly position: string;

    /**
     * Initializes a new PreThing.
     *
     * @param thing   The Thing, freshly created by ObjectMaker.make.
     * @param reference   The creation Object instruction used to create the Thing.
     */
    public constructor(thing: IThing, reference: IPreThingSettings, objectMaker: IObjectMakr) {
        this.thing = thing;
        this.title = thing.title;
        this.reference = reference;
        this.spawned = false;

        this.left = reference.x || 0;
        this.top = reference.y || 0;

        // tslint:disable
        this.right = this.left + (reference.width || objectMaker.getPrototypeOf<IPreThingSettings>(this.title).width!);
        this.bottom = this.top + (reference.height || objectMaker.getPrototypeOf<IPreThingSettings>(this.title).heigh!);
        // tslint:enable

        if (reference.position) {
            this.position = reference.position;
        }
    }
}
