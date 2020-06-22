<!-- Top -->

# StateHoldr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/StateHoldr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/StateHoldr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/StateHoldr)
[![NPM version](https://badge.fury.io/js/stateholdr.svg)](http://badge.fury.io/js/stateholdr)

General localStorage saving for collections of state.

<!-- /Top -->

## Usage

StateHoldr is targeted for use in games where discrete areas within the game map may contain separate changes.
A house, for example, could contain a `pot1` with `{ broken: boolean }` that should be retrieved when the area loads and saved when left.
This is referred to in StateHoldr as a "collection" of state.

Collections are serialized to JSON when switched into storage.

### Constructor

```typescript
const stateHolder = new StateHoldr();
```

#### `collection`

Starting collection to change within, if not `""`.

```typescript
const stateHolder = new StateHoldr(
    collection: "house",
});
```

> The collection can later be changed with `.setCollection(collectionKey)`.

#### `itemsHolder`

Stores persistent changes locally.
If not provided, a `new ItemsHoldr()` is used.

```typescript
const itemsHolder = new ItemsHoldr();
const stateHolder = new StateHoldr({ itemsHolder });
```

#### `prefix`

Prefix to prepend to keys in storage.
Collections are stored under the prefix concatenated with their name.
A `string[]` of collection keys (excluding the prefix) is stored under the prefix concatenated with `"collectionKeys"` (exported from `"stateholdr"` as `collectionKeysItemName`).

```typescript
const itemsHolder = new ItemsHoldr();
const stateHolder = new StateHoldr({
    collection: "house",
    itemsHolder,
    prefix: "MyStateHoldr::",
});

itemsHolder.getItem("MyStateHoldr::collectionKeys"); // ["house"]
```

---

### `addChange`

Parameters:

-   `itemKey: string`: Key of the item to add a change under.
-   `attribute: string`: Attribute of the item being changed.
-   `value: any`: Value under the attribute to change.

Adds a change to an object under the current collection.

```typescript
stateHolder.addChange("pot1", "broken", true);

stateHolder.getChanges("pot1"); // { broken: true }
```

### `addChangeToCollection`

Parameters:

-   `otherCollectionKey: string`: Key of the collection to change within.
-   `itemKey: string`: Key of the item to add a change under.
-   `attribute: string`: Attribute of the item being changed.
-   `value: any`: Value under the attribute to change.

Adds a change to an object under a named collection.

```typescript
stateHolder.setCollection("outdoors");
stateHolder.getChanges("pot1"); // {}

stateHolder.addChangeToCollection("house", "pot1", "broken", true);
stateHolder.setCollection("house");

stateHolder.getChanges("pot1"); // { broken: true }
```

### `applyChanges`

Parameters:

-   `itemKey: string`: Key of a contained item.
-   `output: Object`: Recipient for all the changes.

Copies all changes from a contained item into an output item.
Useful when creating objects whose state is reflected by a collection's storage.

```typescript
const pot = {};

stateHolder.addChange("pot1", "broken", true);
stateHolder.applyChanges("pot1", pot);

pot; // { broken: true }
```

### `getChanges`

Parameters:

-   `itemKey: string`: Key of a contained item.

Returns: Any changes under the itemKey, or `{}` if there were none.

```typescript
stateHolder.addChange("pot1", "broken", true);

stateHolder.getChanges("pot1"); // { broken: true }
```

### `setCollection`

Parameters:

-   `collectionKey: string`: Key of a new collection to switch to.
-   `value: Object` _(optional)_: Container to override any existing state with.

Sets the currently tracked collection.

```typescript
stateHolder.addChangeToCollection("house", "pot1", "broken", true);
stateHolder.setCollection("house");

stateHolder.getChanges("pot1"); // { broken: true }
```

> The previous collection is saved to storage.

### `saveCollection`

Saves the currently tracked collection into storage.

```typescript
stateHolder.setCollection("house");
stateHolder.addChange("pot1", "broken", true);
itemsHolder.getItem("MyStateHoldr::house"); // {}

stateHolder.saveCollection();
itemsHolder.getItem("MyStateHoldr::house"); // { broken: true }
```

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/StateHoldr
cd StateHoldr
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
