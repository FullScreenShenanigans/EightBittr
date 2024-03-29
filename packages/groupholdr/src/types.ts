/**
 * Object containing members of type TItem.
 *
 * @template Item   Type of members of the object.
 */
export type Dictionary<Item> = Record<string, Item | undefined>;

/**
 * Actor that may be stored in a group.
 */
export interface Actor {
    /**
     * Unique identifier generated for the Actor.
     */
    id?: string;
}

/**
 * Groups of Actors.
 *
 * @template TGroupTypes   Types of Actors stored in each group.
 */
export type Groups<TGroupTypes extends GroupTypes<Actor>> = {
    [i in keyof TGroupTypes]: TGroupTypes[i][];
};

/**
 * Describes Actor types in groups.
 *
 * @template TGroupTypes   Types of Actors stored in each group.
 */
export type GroupTypes<TActor extends Actor> = Record<string, TActor>;

/**
 * Performs an action on an Actor.
 *
 * @template TActor   Type of Actor to act upon.
 * @param actor   Actor to act upon.
 */
export type ActorAction<TActor extends Actor = Actor> = (actor: TActor) => void;

/**
 * Settings to initialize a new GroupHoldr.
 */
export interface GroupHoldrSettings<TGroupTypes extends GroupTypes<Actor>> {
    /**
     * Names of groups to be created.
     */
    groupNames?: (keyof TGroupTypes)[];
}
