import { Actor, ActorAction, Dictionary, GroupHoldrSettings, Groups, GroupTypes } from "./types";

/**
 * Creates a group under each name.
 *
 * @param groupNames   Names of groups to create.
 * @returns Object with a blank group array under each group name.
 */
const createGroups = <TGroupTypes extends GroupTypes<Actor>>(
    groupNames: (keyof TGroupTypes)[]
): Groups<TGroupTypes> => {
    const groups: Partial<Groups<TGroupTypes>> = {};

    for (const groupName of groupNames) {
        groups[groupName] = [] as any;
    }

    return groups as Groups<TGroupTypes>;
};

/**
 * A general storage abstraction for keyed containers of items.
 */
export class GroupHoldr<TGroupTypes extends GroupTypes<Actor>>
    implements GroupHoldr<TGroupTypes>
{
    /**
     * Groups of stored Actors.
     */
    private readonly groups: Groups<TGroupTypes>;

    /**
     * Names of groups.
     */
    private readonly groupNames: (keyof TGroupTypes)[];

    /**
     * Stored Actors, keyed by id.
     */
    private actorsById: Dictionary<Actor>;

    /**
     * Initializes a new instance of the GroupHoldr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: GroupHoldrSettings<TGroupTypes>) {
        this.groupNames = settings.groupNames === undefined ? [] : settings.groupNames;

        this.groups = createGroups(this.groupNames);
        this.actorsById = {};
    }

    /**
     * Adds an Actor to a group.
     *
     * @param actor   Actor to add.
     * @param groupName   Name of a group to add the Actor to.
     */
    public addToGroup(
        actor: TGroupTypes[typeof groupName],
        groupName: keyof TGroupTypes & string
    ): void {
        this.ensureGroupExists(groupName);

        this.groups[groupName].push(actor);

        if (actor.id !== undefined) {
            this.actorsById[actor.id] = actor;
        }
    }

    /**
     * Performs an action on all Actors in a group.
     *
     * @param groupName   Name of a group to perform actions on the Actors of.
     * @param action   Action to perform on all Actors in the group.
     */
    public callOnGroup(
        groupName: keyof TGroupTypes & string,
        action: ActorAction<TGroupTypes[typeof groupName]>
    ): void {
        this.ensureGroupExists(groupName);

        for (const actor of this.groups[groupName]) {
            action(actor);
        }
    }

    /**
     * Gets the Actors under a group.
     *
     * @template TGroupKey   Name of a group.
     * @param groupName   Name of a group.
     * @returns Actors under the group name.
     */
    public getGroup<TGroupKey extends keyof TGroupTypes & string>(
        groupName: TGroupKey
    ): TGroupTypes[TGroupKey][] {
        this.ensureGroupExists(groupName);

        return this.groups[groupName];
    }

    /**
     * Gets an Actor by its ID.
     *
     * @param id   ID of an Actor.
     * @returns Actor under the ID, if it exists.
     */
    public getActor<TActor extends Actor = Actor>(id: string): TActor | undefined {
        return this.actorsById[id] as TActor;
    }

    /**
     * Removes an Actor from a group.
     *
     * @param actor   Actor to remove.
     * @param groupName   Name of a group to remove the Actor from.
     * @returns Whether the Actor was in the group to begin with.
     */
    public removeFromGroup(
        actor: TGroupTypes[typeof groupName],
        groupName: keyof TGroupTypes & string
    ): boolean {
        this.ensureGroupExists(groupName);

        if (actor.id !== undefined) {
            this.actorsById[actor.id] = undefined;
        }

        const group = this.groups[groupName];
        const indexInGroup = group.indexOf(actor);

        if (indexInGroup === -1) {
            return false;
        }

        group.splice(indexInGroup, 1);
        return true;
    }

    /**
     * Switches an Actor's group.
     *
     * @param actor   Actor to switch.
     * @param oldGroupName   Name of the original group containing the Actor.
     * @param newGroupName   Name of the new group to add the Actor to.
     */
    public switchGroup(
        actor: TGroupTypes[typeof oldGroupName] & TGroupTypes[typeof newGroupName],
        oldGroupName: keyof TGroupTypes & string,
        newGroupName: keyof TGroupTypes & string
    ): void {
        this.removeFromGroup(actor, oldGroupName);
        this.addToGroup(actor, newGroupName);
    }

    /**
     * Performs an action on all Actors in all groups.
     *
     * @param action   Action to perform on all Actors.
     */
    public callOnAll(action: ActorAction): void {
        for (const group of this.groupNames) {
            this.callOnGroup(group as keyof typeof this.groupNames & string, action);
        }
    }

    /**
     * Removes all Actors from all groups.
     */
    public clear(): void {
        for (const groupName of this.groupNames) {
            this.groups[groupName].length = 0;
        }

        this.actorsById = {};
    }

    /**
     * Throws an error if a group doesn't exist.
     *
     * @param groupName   Name of a group.
     */
    private ensureGroupExists(groupName: keyof TGroupTypes & string): void {
        if (!{}.hasOwnProperty.call(this.groups, groupName)) {
            throw new Error(`Unknown group: '${groupName}'.`);
        }
    }
}
