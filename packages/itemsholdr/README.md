<!-- Top -->

# ItemsHoldr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/ItemsHoldr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/ItemsHoldr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/ItemsHoldr)
[![NPM version](https://badge.fury.io/js/itemsholdr.svg)](http://badge.fury.io/js/itemsholdr)

Cache-based wrapper around localStorage.

<!-- /Top -->

ItemsHoldr instances intentionally implement the DOM `Storage` interface _(except for the hacky string- and number-based indexing)_.
You can use them wherever you would use `localStorage`.

ItemsHoldr adds a layer of caching and value-based hooks that makes it useful for applications where state isn't always saved immediately.
It also defaults values to `undefined` instead of `null` for sanity.

## Usage

### Constructor

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("name", "Blue");

itemsHolder.getItem("name"); // "Blue"
```

#### `autoSave`

Whether values should be saved immediately upon being set.

An internal reference to a storage container is kept that defaults to `localStorage`.
Keys won't be saved to that container until `.saveItem(key)` or `saveAll()` are called.
Providing `autoSave` changes that behavior to always save the items to the internal container.

```typescript
const itemsHolder = new ItemsHoldr({
    autoSave: true,
});

itemsHolder.setItem("name", "Blue");

localStorage.getItem("name"); // "Blue"
```

#### `defaults`

Default attributes for item values.
These are applied to all items, and will be overriden per item by an item-specific `values`.

```typescript
const itemsHolder = new ItemsHoldr({
    defaults: {
        valueDefault: "Red",
    },
});

itemsHolder.getItem("name"); // "Red"
```

#### `prefix`

Prefix to add before keys in storage.
Useful to distinguish keys from other stored items in the same storage container, such as a webpage's `localStorage`.

```typescript
const itemsHolder = new ItemsHoldr({
    prefix: "MyState::",
});

itemsHolder.saveItem("name", "Red");

Object.keys(localStorage); // ["MyState::name"]
```

#### `storage`

Storage object to use instead of the global localStorage.
This can be anything that satisfies the `Storage` API and acts like `localStorage`.

ItemsHoldr exposes a `createStorage` that can be useful for testing.

```typescript
import { createStorage, ItemsHoldr } from "itemsholdr";

const storage = createStorage();
const itemsHolder = new ItemsHoldr({
    storage,
});

itemsHolder.saveItem("name", "Red");

storage.getItem("name"); // "Red"
storage.name; // "Red"
```

#### `values`

Initial settings for item values to store.
These are factored on top of `defaults` for created items.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        name: {
            valueDefault: "Blue",
        },
    },
});

itemsHolder.getItem("name"); // "Blue"
```

---

### Value Settings

Declaring items with `defaults` and/or `values` allows for individual settings applied to that item.
These are also applied when using `.addItem(name, settings)`.

#### `maximum`

Maximum value the item may equal if a number.
If set to something higher, it will immediately be set to the `maximum`.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        coins: {
            maximum: 100,
        },
    },
});

itemsHolder.setItem("coins", 101);

itemsHolder.getItem("coins"); // 100
```

#### `onMaximum`

Callback for when the value reaches the maximum value.
Takes in the value _before_ capped to the the `maximum`.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        coins: {
            maximum: 100,
            onMaximum: (coins) => {
                console.log("Got", coins, "coins.");
            },
        },
    },
});

// Got 101 coins.
itemsHolder.setItem("coins", 101);

itemsHolder.getItem("coins"); // 100
```

#### `minimum`

Minimum value the item may equal if a number.
If set to something lower, it will immediately be set to the `minimum`.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        lives: {
            minimum: 100,
        },
    },
});

itemsHolder.setItem("lives", -1);

itemsHolder.getItem("lives"); // 0
```

#### `onMinimum`

Callback for when the value reaches the minimum value.
Takes in the value _before_ floored to the the `minimum`.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        lives: {
            minimum: 0,
            onMinimum: (lives) => {
                console.log("Dropped to", lives, "lives.");
            },
        },
    },
});

// Dropped to -1 lives.
itemsHolder.setItem("lives", -1);

itemsHolder.getItem("lives"); // 0
```

#### `modularity`

Maximum number to modulo the value against if a number.
If set to something higher, it will be reduced by `modularity` until less than.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        coins: {
            modularity: 100,
        },
    },
});

itemsHolder.setItem("coins", 250);

itemsHolder.getItem("coins"); // 50
```

#### `onModular`

Callback for when the value reaches modularity.
Unlike `onMaximum`, this will be repeatedly called while the value is greater, decreasing by `modularity` each time.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        coins: {
            modularity: 100,
            onModular: (reduced) => {
                console.log("Reduced", coins, "coins.");
            },
        },
    },
});

// Reduced 100 coins.
// Reduced 50 coins.
itemsHolder.setItem("coins", 250);

itemsHolder.getItem("coins"); // 50
```

#### `triggers`

A mapping of values to callbacks that should be triggered when the value is equal to them.
These all take in the item's value.

```typescript
const logForSpeed = (speed: number) => {
    console.log("Achieved", speed, "speed.");
};

const itemsHolder = new ItemsHoldr({
    values: {
        speed: {
            triggers: {
                0: logForSpeed,
                10: logForSpeed,
            },
        },
    },
});

// Achieved 0 speed.
itemsHolder.setItem("coins", 0);

itemsHolder.setItem("coins", 5);

// Achieved 10 speed.
itemsHolder.setItem("coins", 10);
```

#### `valueDefault`

An initial value to use if before any is set.
Will be overriden by what's in `storage` if `storeLocally` is true.

```typescript
const itemsHolder = new ItemsHoldr({
    values: {
        name: {
            valueDefault: "Blue",
        },
    },
});

itemsHolder.getItem("name"); // "Blue"
```

---

### `addItem`

Parameters:

-   `name: string`: Unique key to store the item under.
-   `settings: Object` _(optional)_: Any additional settings for the item.

Adds a new item to storage.
If an existing item exists under the same, its settings are discarded.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.addItem("name", {
    valueDefault: "Blue",
});

itemsHolder.getItem("name"); // "Blue"
```

### `getItem`

Parameters:

-   `key: string`: Key of an item.

Gets the value under the name.

Unlike `localStorage`, this will throw an error if the item doesn't exist.
Use `hasKey` if you want to check whether an item exists.

### `removeItem`

Parameters:

-   `key: string`: Key of an item.

Removes the item under that key from storage.
If `getItem` is called after `removeItem` with the same key, it's as if the item was never added in the first place.
Any settings passed into the constructor will be re-applied.

```typescript
const itemsHolder = new ItemsHoldr({
    defaults: {
        valueDefault: "Blue",
    },
});

itemsHolder.setItem("name", "Blue");

itemsHolder.removeItem("name");

itemsHolder.getItem("name"); // "Red"
```

### `setItem`

Parameters:

-   `key: string`: Key of an item.

Sets the value of an item.
If the item doesn't yet exist, it's created.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("name", "Blue");

itemsHolder.getItem("name"); // "Blue"
```

### `increase`

Parameters:

-   `key: string`: Key of an item.
-   `amount: number | string` Amount to increase by (by default, `1`).

Increases the value of an item as a number or string.
This uses the native `+` operator regardless of the value type.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("coins", 7);
itemsHolder.increase("coins", 3);

itemsHolder.getItem("coins"); // 10
```

### `increase`

Parameters:

-   `key: string`: Key of an item.
-   `amount: number` Amount to decreases by (by default, `1`).

Decreases the value of an item as a number.
This uses the native `-` operator regardless of the value type.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("coins", 7);
itemsHolder.decrease("coins", 3);

itemsHolder.getItem("coins"); // 4
```

### `toggle`

Parameters:

-   `key: string`: Key of an item.

Toggles whether an item is true or false.
This evaluates the item in a ternary for truthiness.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("alive", false);
itemsHolder.toggle("alive");

itemsHolder.getItem("alive"); // true
```

### `hasKey`

Parameters:

-   `key: string`: Key of an item.

Gets whether an item exists under the key.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("alive", false);

itemsHolder.hasKey("alive"); // true
itemsHolder.hasKey("unknown"); // false
```

### `exportItems`

Gets a summary of keys and their values.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("alive", false);
itemsHolder.setItem("coins", 10);
itemsHolder.setItem("name", "Blue");

/*
{
    alive: false,
    coins: 10,
    name: "Blue",
}
*/
itemsHolder.exportItems();
```

### `clear`

Completely clears all items.
This is equivalent to calling `removeItem` on all keys.
Any settings passed into the constructor will be re-applied.

```typescript
const itemsHolder = new ItemsHoldr({
    defaults: {
        valueDefault: "Blue",
    },
});

itemsHolder.setItem("name", "Blue");

itemsHolder.clear();

itemsHolder.getItem("name"); // "Red"
```

### `saveItem`

Parameters:

-   `key: string`: Name of an item.

Manually saves an item's value to storage, ignoring `autoSave` settings.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("name", "Blue");

localStorage.getItem("name"); // null

itemsHolder.saveItem("name");

localStorage.getItem("name"); // "Blue"
```

### `saveAll`

Manually saves all items to storage, ignoring `autoSave` settings.

```typescript
const itemsHolder = new ItemsHoldr();

itemsHolder.setItem("name", "Blue");

localStorage.getItem("name"); // null

itemsHolder.saveAll();

localStorage.getItem("name"); // "Blue"
```

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/ItemsHoldr
cd ItemsHoldr
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
