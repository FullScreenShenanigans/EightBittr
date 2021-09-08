<!-- Top -->

# GroupHoldr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/groupholdr.svg)](http://badge.fury.io/js/groupholdr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

General storage abstraction for keyed containers of items.

<!-- /Top -->

## Usage

Each GroupHoldr instance contains a predefined set of named "groups" represented by an array of objects.
Each object may have an `id` to look it up under.

> Object IDs are treated as unique, but allowed to overlap existing IDs.

### Constructor

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});
```

Objects are referred to as "`Actor`s" in the documentation.

#### `groupNames`

String names of groups to be created.

#### Usage with TypeScript

GroupHoldr has a `TGroupTypes extends GroupTypes<Actor>` template, where `groupNames` is `keyof TGroupTypes` and `GroupTypes` is a dictionary of `Actor`s.
Use this to specify the types of stored actors.

```typescript
interface Solid {
    id: string;
    size: number;
}

const groupHolder = new GroupHoldr<{ Solid: Solid }>({
    groupNames: ["Solid"],
});
```

---

### `addToGroup`

Parameters:

-   `actor: Object`: Actor to add.
-   `groupName: string`: Name of a group to add the Actor to.

Adds an actor to a group.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

const block = {
    id: "block1",
    size: 8,
};

groupHolder.addToGroup(block, "Solid");
```

### `callOnGroup`

Parameters:

-   `groupName: string`: Name of a group to perform actions on the Actors of.
-   `action: Function`: Action to perform on all Actors in the group.

Performs an action on all Actors in a group.
Equivalent to `Array.forEach` with just the Actors as a parameter.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

const logSolid = (actor) => {
    console.log("ID:", actor.id);
};

groupHolder.addToGroup({ id: "block1" }, "Solid");
groupHolder.addToGroup({ id: "block2" }, "Solid");

// ID: block1
// ID: block2
groupHolder.callOnGroup("Solid", logSolid);
```

### `getGroup`

Parameters:

-   `groupName: string`: Name of a group.

Returns: Actors under the group.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

groupHolder.addToGroup({ id: "block1" }, "Solid");
groupHolder.addToGroup({ id: "block2" }, "Solid");

/*
[
    { id: "block1" },
    { id: "block2" },
]
*/
groupHolder.getGroup("Solid");
```

### `getActor`

Parameters:

-   `id: string`: D of an Actor

Returns: Actor under the ID, if it exists.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

groupHolder.addToGroup({ id: "block1" }, "Solid");

groupHolder.getActorById("block1"); // { id: "block1" }
groupHolder.getActorById("unknown"); // undefined
```

> If two Actors with the same ID are added, the second will override the first.

### `removeFromGroup`

Parameters:

-   `actor: Object`: Actor to remove.
-   `groupName: string`: Name of the group containing the Actor.

Returns: Whether the Actor was in the group to begin with.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

const solid = { id: "block1" };

groupHolder.addToGroup(solid, "Solid");

groupHolder.removeFromGroup("Solid"); // { id: "block1" }
groupHolder.getActorById("block0"); // undefined
```

### `switchGroup`

Parameters:

-   `actor: Object`: Actor to switch.
-   `oldGroupName: string`: Name of the original group containing the Actor.
-   `newGroupName: string`: Name of the new group to add the Actor to.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Scenery", "Solid"],
});

const block = { id: "block1" };

groupHolder.addToGroup(block, "Solid");
groupHolder.switchGroup(block, "Solid", "Scenery");

/*
[
    { id: "block1" },
]
*/
groupHolder.getGroup("Scenery");
```

### `callOnAll`

Parameters:

-   `action: Function`: Action to perform on all Actors.

Performs an action on all Actors in all groups.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Scenery", "Solid"],
});

const logActor = (actor) => {
    console.log("ID:", actor.id);
};

groupHolder.addToGroup({ id: "block1" }, "Scenery");
groupHolder.addToGroup({ id: "block2" }, "Solid");

// ID: block1
// ID: block2
groupHolder.callOnAll(logActor);
```

### `clear`

Removes all Actors from all groups.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Scenery", "Solid"],
});

const logActor = (actor) => {
    console.log("ID:", actor.id);
};

groupHolder.addToGroup({ id: "block1" }, "Scenery");
groupHolder.addToGroup({ id: "block2" }, "Solid");

groupHolder.clear();

groupHolder.getGroup("Scenery"); // []
groupHolder.getGroup("Solid"); // []
```

<!-- Development -->

## Development

This repository is a portion of the [EightBittr monorepo](https://raw.githubusercontent.com/FullScreenShenanigans/EightBittr).
See its [docs/Development.md](../../docs/Development.md) for details on how to get started. 💖

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
