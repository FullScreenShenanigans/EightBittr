<!-- Top -->

# StateHoldr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/stateholdr.svg)](http://badge.fury.io/js/stateholdr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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
