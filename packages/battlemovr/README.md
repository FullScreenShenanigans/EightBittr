<!-- Top -->
# BattleMovr

[![NPM version](https://badge.fury.io/js/battlemovr.svg)](http://badge.fury.io/js/battlemovr)

Drives RPG-like battles between two teams of actors.
<!-- /Top -->

## Battles

BattleMovr coordinates "battles" in which two teams of actors take turns choosing and executing attacks.
Each team has one actor considered "active" at any given time.
Between turns, teams are given the option to choose the move they'll take the coming turn.

> Consider these battles to follow the model of traditional RPGs such as Pokemon.

### Actors

Each actor in a team may participate in the battle.
They have at least the following attributes:

-   `moves`: Battle moves the actor knows.
-   `nickname`: Textual name for the actor.
-   `statistics`: Mutable in-battle statistics, which include at least `health`.
-   `title`: Sprite title the actor displays as.

Actors may be selected for battle as long as their `.statistics.health.current` isn't `0`.

### Actions

There are four types of actions a team may choose to take:

-   `flee`: The team attempts to leave the battle.
-   `item`: The team attempts to use an item.
-   `move`: The team's selected actor uses a battle move.
-   `switch`: The team switches which actor is selected.

## Usage

### Constructor

```typescript
const battleMover = new BattleMovr({
    actionsOrderer(
        actions: IUnderEachTeam<IAction>
    ): ITeamAndAction<IAction>[] {
        // Returns the actions in the order they should occur.
    },
    animations: {
        complete(outcome: BattleOutcome, onComplete?: () => void): void {
            // Animates the battle finishing; calls onComplete when done if provided.
        },
        opponent: {
            actions: {
                flee(
                    teamAction: ITeamAndAction<IFleeAction>,
                    onComplete: () => void
                ): void {
                    // Animates the team choosing to flee.
                },
                item(
                    teamAction: ITeamAndAction<IItemAction>,
                    onComplete: () => void
                ): void {
                    // Animates the team choosing to use an item.
                },
                move(
                    teamAction: ITeamAndAction<IMoveAction>,
                    onComplete: () => void
                ): void {
                    // Animates the team choosing to use an actor move.
                },
                switch(
                    teamAction: ITeamAndAction<ISwitchAction>,
                    onComplete: () => void
                ): void {
                    // Animates the team choosing to switch actors.
                },
            },
            healthChange(health: number, onComplete: () => void): void {
                // Animates an actor's health changing.
            },
            introduction(onComplete: () => void): void {
                // Animates the team introducing itself.
            },
            switching: {
                enter(onComplete: () => void): void {
                    // Animates an actor entering battle.
                },
                exit(onComplete: () => void): void {
                    // Animates an actor exiting battle.
                },
                knockout(onComplete: () => void): void {
                    // Animates an actor getting knocked out of battle.
                },
                switch(
                    teamAction: ITeamAndAction<TAction>,
                    onComplete: () => void
                ): void {
                    // Animates a team switching actors.
                },
            },
        },
        player: {
            // (same as the opponent's properties, but for the player!)
        },
        start(onComplete: () => void): void {
            // Animation for a battle starting.
        },
    },
    selectorFactories: {},
});
```

#### `actionsOrderer`

Runs after each team has chosen their moves for an upcoming turn.
It takes in the `IAction` chosen for each team as an `IUnderEachTeam<IAction>` and returns the ordered array of when those actions should take place.

For example, an orderer that prioritizes `flee`, `switch`, `item`, and `move` in that order might look like:

```typescript
const orders = {
    flee: 0,
    switch: 1,
    item: 2,
    move: 3,
};

const actionsOrderer: IActionsOrderer = (
    actions: IUnderEachTeam<IAction>
): ITeamAndAction<IAction>[] => {
    const playerOrder = orders[actions.player];
    const opponentOrder = order[actions.opponent];

    return playerOrder <= opponentOrder
        ? [actions.player, actions.opponent]
        : [actions.opponent, actions.player];
};
```

See [`src/Teams.ts`](./src/Teams.ts) for full type signatures.

#### `animations`

Animation callbacks for various battle activities.
Two basic animation members are:

-   `complete`: Animation for when a battle is complete.
-   `start`: Animation for a battle starting.

Also required are team-specific animations under both `.opponent` and `.player`:

-   `actions`: Animations for in-battle selected actions, keyed by their type names (see names above).
-   `healthChange`: Animation for when an actor's health changes.
-   `introduction`: Animation for a team introducing itself at the beginning of battle.
-   `switching`: Animations for actors switching positions, which are:
    -   `enter`: Animation for an actor entering battle.
    -   `exit`: Animation for an ector exiting battle.
    -   `knockout`: Animation for an actor getting knocked out.
    -   `switch`: Animation for actors being swapped.

See [`src/Animations.ts`](./src/Animations.ts) for full type signatures.

#### `selectorFactories`

An object containing methods that return action selectors usable by teams.
An action selector contains methods for the team to choose their next action between battle turns.
Each selector contains:

-   `afterKnockout`: Reacts to the selected actor having just been knocked out.
-   `nextAction`: Determines the next action while there is still a selected actor.

These are keyed by names that will be specified by teams entering battle.
For example, a `"cowardly"` selector might always choose a `flee` action:

```typescript
const selectorFactories = {
    cowardly: () => () => ({
        afterKnockout: () => {},
        nextAction: (_, _, onChoice) => {
            onChoice({
                type: "flee",
            });
        },
    }),
};
```

> `afterKnockout` doesn't provide an `onChoice`; it might be refactored to `animations`.

See [`src/Selectors.ts`](./src/Selectors.ts) for full type signatures.

### `inBattle`

Returns whether there is a current battle.
Subsequent methods will throw errors if not used in the correct battle state.

-   `startBattle` throws an error if a battle is already ongoing.
-   `getBattleInfo`, `stopBattle`, and `switchSelectedActor` throw if a battle isn't ongoing.

### `startBattle`

Starting a battle requires passing two teams to participate in the battle.
As with other containers, teams are named `opponent` and `player`.
Each team must at least contain:

-   `actors`: Array of actors that will fight.
-   `selector`: How the team chooses their actions (see above).

Teams may also specify a `teamLeader` with an actor-like `nickname` and `title`.
Team leaders, if they exist, are animated animated to show actors entering or leaving battle.

For example, simulating battles between two robots, where the player is piloted by a human:

```typescript
FSP.battles.startBattle({
    teams: {
        opponent: {
            actors: [
                {
                    moves: [
                        {
                            title: "Bend",
                            remaining: 10,
                            uses: 10,
                        },
                    ],
                    nickname: "Flexo".split(""),
                    statistics: {
                        health: {
                            current: 100,
                            normal: 100,
                        },
                    },
                    title: "BendingUnit22".split(""),
                },
            ],
            selector: "angry",
        },
        player: {
            actors: [
                {
                    moves: [
                        {
                            title: "Bend",
                            remaining: 10,
                            uses: 10,
                        },
                    ],
                    nickname: "Bender".split(""),
                    statistics: {
                        health: {
                            current: 100,
                            normal: 100,
                        },
                    },
                    title: "BendingUnit22".split(""),
                },
            ],
            leader: {
                nickname: "Fry".split(""),
                title: "LazyHuman".split(""),
            },
            selector: "angry",
        },
    },
});
```

### `stopBattle`

Reports that the battle has completed with a particular outcome.
This is typically used by one of the above animations in response to an action taken.
For example, a `flee` action's animation would typically call it when complete:

```typescript
const animateOpponentFlee = (
    teamAction: ITeamAndAction<IFleeAction>,
    onComplete: () => void
): void => {
    console.log("Opponent ran away!");
    battleMover.stopBattle(BattleOutcome.opponentFled, onComplete);
};
```

### `switchSelectedActor`

Switches the selected actor for a team.
This takes in the `Team` enum being switched and its new actor.
It will call the relevant animations in sequential order.

> The new actor is expected to be in that team's list of actors.

<!-- Development -->
## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its README.md for details on how to get started. 💖

### Running Tests

```shell
yarn run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `yarn run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests, or run `yarn test:run` to run them in headless Chrome.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
