/**
 * Object containing members of type TItem.
 *
 * @template TItem   Type of members of the object.
 */
export interface IDictionary<TItem> {
    [i: string]: TItem | undefined;
}

/**
 * Thing that may be stored in a group.
 */
export interface IThing {
    id: string;
}

/**
 * Groups of Things.
 *
 * @template TGroupTypes   Types of Things stored in each group.
 */
export type IGroups<TGroupTypes extends IGroupTypes<IThing>> = {
    [i in keyof TGroupTypes]: TGroupTypes[i][];
};

/**
 * Describes Thing types in groups.
 *
 * @template TGroupTypes   Types of Things stored in each group.
 */
export interface IGroupTypes<TThing extends IThing> {
    [i: string]: TThing;
}

/**
 * Performs an action on a Thing.
 *
 * @param thing   Thing to act upon.
 */
export type IThingAction = (thing: IThing) => void;

/**
 * Settings to initialize a new IGroupHoldr.
 */
export interface IGroupHoldrSettings<TGroupTypes extends IGroupTypes<IThing>> {
    /**
     * Names of groups to be created.
     */
    groupNames?: (keyof TGroupTypes)[];
}

/**
 * Storage for separate group arrays of members with unique IDs.
 *
 * @template TThing   Common type for all group members.
 * @template TGroupTypes   Types stored within each group.
 */
export interface IGroupHoldr<TGroupTypes extends IGroupTypes<IThing>> {
    /**
     * Adds a Thing to a group.
     *
     * @param thing   Thing to add.
     * @param groupName   Name of a group to add the Thing to.
     */
    addToGroup(thing: IThing, groupName: keyof TGroupTypes): void;

    /**
     * Removes all things from all groups.
     */
    clear(): void;

    /**
     * Performs an action on all Things in all groups.
     *
     * @param action   Action to perform on all Things.
     */
    callOnAll(action: IThingAction): void;

    /**
     * Performs an action on all Things in a group.
     *
     * @param groupName   Name of a group to perform actions on the Things of.
     * @param action   Action to perform on all Things in the group.
     */
    callOnGroup(groupName: keyof TGroupTypes, action: IThingAction): void;

    /**
     * Gets the Things under a group.
     *
     * @template TGroupKey   Name of a group.
     * @param groupName   Name of a group.
     * @returns Things under the group name.
     */
    getGroup<TGroupKey extends keyof TGroupTypes>(groupName: TGroupKey): TGroupTypes[TGroupKey][];

    /**
     * Gets a Thing by its ID.
     *
     * @param id   ID of a Thing.
     * @returns Thing under the ID, if it exists.
     */
    getThing(id: string): IThing | undefined;

    /**
     * Removes a Thing from a group.
     *
     * @param thing   Thing to remove.
     * @param groupName   Name of a group to remove the Thing from.
     * @returns Whether the Thing was in the group to begin with.
     */
    removeFromGroup(thing: IThing, groupName: keyof TGroupTypes): void;

    /**
     * Switches a Thing's group.
     *
     * @param thing   Thing to switch.
     * @param oldGroupName   Original group containing the Thing.
     * @param newGroupName   New group to add the Thing to.
     */
    switchGroup(thing: IThing, oldGroupName: keyof TGroupTypes, newGroupName: keyof TGroupTypes): void;
}
