/**
 * An in-game object created from an IPreThing.
 */
export interface IThing {
    /**
     * The name of the Thing's constructor type, from the MapsCreatr's ObjectMakr.
     */
    title: string;

    /**
     * An optional group for the Thing to be in, keyed by its id.
     */
    collection?: any;

    /**
     * The key of the collection to place this Thing in, if collection isn't undefined.
     */
    collectionKey?: string;

    /**
     * The name this is referred to in its collection, if collection isn't undefined.
     */
    collectionName?: string;

    /**
     * Where this is an entrance to, if anywhere.
     */
    entrance?: string;

    /**
     * Which type of Thing thisis.
     */
    groupType: string;

    /**
     * Whether this should skip stretching the boundaries of an area
     */
    noBoundaryStretch?: boolean;
}
