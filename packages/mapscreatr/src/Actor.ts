/**
 * An in-game object created from a PreActor.
 */
export interface Actor {
    /**
     * The name of the Actor's constructor type, from the MapsCreatr's ObjectMakr.
     */
    title: string;

    /**
     * An optional group for the Actor to be in, keyed by its id.
     */
    collection?: any;

    /**
     * The key of the collection to place this Actor in, if collection isn't undefined.
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
     * Which type of Actor thisis.
     */
    groupType: string;

    /**
     * Whether this should skip stretching the boundaries of an area
     */
    noBoundaryStretch?: boolean;
}
