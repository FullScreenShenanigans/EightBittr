import { IDictionary, IGroupHoldr, IGroupHoldrSettings, IGroups, IGroupTypes, IThing } from "./IGroupHoldr";

/**
 * Creates a group under each name.
 *
 * @param groupNames   Names of groups to create.
 * @returns Object with a blank group array under each group name.
 */
const createGroups = <TGroupTypes extends IGroupTypes<IThing>>(groupNames: string[]): IGroups<TGroupTypes> => {
    const groups: Partial<IGroups<TGroupTypes>> = {};

    for (const groupName of groupNames) {
        groups[groupName] = [];
    }

    return groups as IGroups<TGroupTypes>;
};

/**
 * A general storage abstraction for keyed containers of items.
 */
export class GroupHoldr<TGroupTypes extends IGroupTypes<IThing>> implements IGroupHoldr<TGroupTypes> {
    /**
     * Groups of stored Things.
     */
    private readonly groups: IGroups<TGroupTypes>;

    /**
     * Names of groups.
     */
    private readonly groupNames: (keyof TGroupTypes)[];

    /**
     * Stored Things, keyed by id.
     */
    private thingsById: IDictionary<IThing>;

    /**
     * Initializes a new instance of the GroupHoldr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IGroupHoldrSettings<TGroupTypes>) {
        this.groupNames = settings.groupNames === undefined
            ? []
            : settings.groupNames;

        this.groups = createGroups(this.groupNames);
        this.thingsById = {};
    }

    /**
     * Adds a Thing to a group.
     *
     * @param thing   Thing to add.
     * @param group   Name of a group to add the Thing to.
     */
    public addToGroup(thing: IThing, group: keyof TGroupTypes): void {
        this.ensureGroupExists(group);

        this.groups[group].push(thing);
        this.thingsById[thing.id] = thing;
    }

    /**
     * Removes all things from all groups.
     */
    public clear(): void {
        for (const groupName of this.groupNames) {
            this.groups[groupName].length = 0;
        }

        this.thingsById = {};
    }

    /**
     * Performs an action on all Things in all groups.
     *
     * @param action   Action to perform on all Things.
     */
    public callOnAll(action: (thing: IThing) => void): void {
        for (const group of this.groupNames) {
            this.callOnGroup(group, action);
        }
    }

    /**
     * Performs an action on all Things in a group.
     *
     * @param groupName   Name of a group to perform actions on the Things of.
     * @param action   Action to perform on all Things in the group.
     */
    public callOnGroup(groupName: keyof TGroupTypes, action: (thing: IThing) => void): void {
        this.ensureGroupExists(groupName);

        for (const thing of this.groups[groupName]) {
            action(thing);
        }
    }

    /**
     * Gets the Things under a group.
     *
     * @template TGroupKey   Name of a group.
     * @param groupName   Name of a group.
     * @returns Things under the group name.
     */
    public getGroup<TGroupKey extends keyof TGroupTypes>(groupName: TGroupKey): TGroupTypes[TGroupKey][] {
        this.ensureGroupExists(groupName);

        return this.groups[groupName];
    }

    /**
     * Gets a Thing by its ID.
     *
     * @param id   ID of a Thing.
     * @returns Thing under the ID, if it exists.
     */
    public getThing(id: string): IThing | undefined {
        return this.thingsById[id];
    }

    /**
     * Removes a Thing from a group.
     *
     * @param thing   Thing to remove.
     * @param groupName   Name of a group to remove the Thing from.
     * @returns Whether the Thing was in the group to begin with.
     */
    public removeFromGroup(thing: IThing, groupName: keyof TGroupTypes): boolean {
        this.ensureGroupExists(groupName);

        this.thingsById[thing.id] = undefined;

        const group = this.groups[groupName];
        const indexInGroup = group.indexOf(thing);

        if (indexInGroup === -1) {
            return false;
        }

        group.splice(indexInGroup, 1);
        return true;
    }

    /**
     * Switches a Thing's group.
     *
     * @param thing   Thing to switch.
     * @param oldGroupName   Original group containing the Thing.
     * @param newGroupName   New group to add the Thing to.
     */
    public switchGroup(thing: IThing, oldGroupName: keyof TGroupTypes, newGroupName: keyof TGroupTypes): void {
        this.removeFromGroup(thing, oldGroupName);
        this.addToGroup(thing, newGroupName);
    }

    /**
     * Throws an error if a group doesn't exist.
     *
     * @param groupName   Name of a group.
     */
    private ensureGroupExists(groupName: string): void {
        if (!{}.hasOwnProperty.call(this.groups, groupName)) {
            throw new Error(`Unknown group: '${groupName}'.`);
        }
    }
}
