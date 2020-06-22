<!-- Top -->

# GroupHoldr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/GroupHoldr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/GroupHoldr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/GroupHoldr)
[![NPM version](https://badge.fury.io/js/groupholdr.svg)](http://badge.fury.io/js/groupholdr)

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

Objects are referred to as "`Thing`s" in the documentation.

#### `groupNames`

String names of groups to be created.

#### Usage with TypeScript

GroupHoldr has a `TGroupTypes extends IGroupTypes<IThing>` template, where `groupNames` is `keyof TGroupTypes` and `IGroupTypes` is a dictionary of `IThing`s.
Use this to specify the types of stored things.

```typescript
interface ISolid {
    id: string;
    size: number;
}

const groupHolder = new GroupHoldr<{ Solid: ISolid }>({
    groupNames: ["Solid"],
});
```

---

### `addToGroup`

Parameters:

-   `thing: Object`: Thing to add.
-   `groupName: string`: Name of a group to add the Thing to.

Adds a thing to a group.

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

-   `groupName: string`: Name of a group to perform actions on the Things of.
-   `action: Function`: Action to perform on all Things in the group.

Performs an action on all Things in a group.
Equivalent to `Array.forEach` with just the Things as a parameter.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

const logSolid = (thing) => {
    console.log("ID:", thing.id);
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

Returns: Things under the group.

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

### `getThing`

Parameters:

-   `id: string`: ID of a Thing

Returns: Thing under the ID, if it exists.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

groupHolder.addToGroup({ id: "block1" }, "Solid");

groupHolder.getThingById("block1"); // { id: "block1" }
groupHolder.getThingById("unknown"); // undefined
```

> If two Things with the same ID are added, the second will override the first.

### `removeFromGroup`

Parameters:

-   `thing: Object`: Thing to remove.
-   `groupName: string`: Name of the group containing the Thing.

Returns: Whether the Thing was in the group to begin with.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Solid"],
});

const solid = { id: "block1" };

groupHolder.addToGroup(solid, "Solid");

groupHolder.removeFromGroup("Solid"); // { id: "block1" }
groupHolder.getThingById("block0"); // undefined
```

### `switchGroup`

Parameters:

-   `thing: Object`: Thing to switch.
-   `oldGroupName: string`: Name of the original group containing the Thing.
-   `newGroupName: string`: Name of the new group to add the Thing to.

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

-   `action: Function`: Action to perform on all Things.

Performs an action on all Things in all groups.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Scenery", "Solid"],
});

const logThing = (thing) => {
    console.log("ID:", thing.id);
};

groupHolder.addToGroup({ id: "block1" }, "Scenery");
groupHolder.addToGroup({ id: "block2" }, "Solid");

// ID: block1
// ID: block2
groupHolder.callOnAll(logThing);
```

### `clear`

Removes all Things from all groups.

```typescript
const groupHolder = new GroupHoldr({
    groupNames: ["Scenery", "Solid"],
});

const logThing = (thing) => {
    console.log("ID:", thing.id);
};

groupHolder.addToGroup({ id: "block1" }, "Scenery");
groupHolder.addToGroup({ id: "block2" }, "Solid");

groupHolder.clear();

groupHolder.getGroup("Scenery"); // []
groupHolder.getGroup("Solid"); // []
```

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/GroupHoldr
cd GroupHoldr
npm install
yarn run setup
yarn run verify
```

-   `yarn run setup` creates a few auto-generated setup files locally.
-   `yarn run verify` builds, lints, and runs tests.

### Building

```shell
yarn run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`yarn run watch` will directly run the TypeScript compiler on source files in watch mode.
Use it in the background while developing to keep the compiled files up-to-date.

#### Running Tests

```shell
yarn run test
```

Tests are written in [Mocha](https://github.com/mochajs/mocha) and [Chai](https://github.com/chaijs/chai).
Their files are written using alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `yarn run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.

<!-- Maps -->
<!-- /Maps -->
<!-- /Development -->
