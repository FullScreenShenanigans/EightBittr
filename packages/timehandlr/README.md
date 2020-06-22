<!-- Top -->

# TimeHandlr

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/TimeHandlr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/TimeHandlr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/TimeHandlr)
[![NPM version](https://badge.fury.io/js/timehandlr.svg)](http://badge.fury.io/js/timehandlr)

Scheduling for dynamically repeating or synchronized events.

<!-- /Top -->

Like [@sinonjs/fake-timers](https://github.com/sinonjs/fake-timers), but for one-time and repeating events in production code.

## Usage

### Constructor

```typescript
import { TimeHandlr } from "timehandlr";

const timeHandler = new TimeHandlr();
```

### `addEvent`

Parameters:

-   `callback: Function`: Callback to run for the event.
-   `timeDelay: number | Function` _(optional)_: How long from now to run the callback (by default, 1).
-   `...args: any[]`: Any additional arguments to pass to the callback.

Returns: An event with the given callback and time information.

Adds an event to be called once.

```typescript
const timeHandler = new TimeHandlr();

timeHandler.addEvent(() => console.log("Hello world!"), 3);

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();
```

If `args` are provided, they're passed to the callback.
This is similar to `Function.call`.

```typescript
const timeHandler = new TimeHandlr();

timeHandler.addEvent(console.log.bind(console), 3, "Hello world!");

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();
```

### `addEventInterval`

Parameters:

-   `callback: Function`: Callback to run for the event.
-   `timeDelay: number | Function` _(optional)_: How long from now to run the callback (by default, 1).
-   `numRepeats: number | Function` _(optional)_: How many times to run the event (by default, 1).
-   `...args: any[]`: Any additional arguments to pass to the callback.

Adds an event to be called multiple times.

```typescript
const timeHandler = new TimeHandlr();

timeHandler.addEventInterval(() => console.log("Hello world!"), 3, 2);

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();
```

If `args` are provided, they're passed to the callback.
This is similar to `Function.call`.

```typescript
const timeHandler = new TimeHandlr();

timeHandler.addEventInterval(console.log.bind(console), 3, "Hello world!");

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();

timeHandler.advance();
timeHandler.advance();

// Hello world!
timeHandler.advance();
```

### `addEventIntervalSynched`

Parameters:

-   `callback: Function`: Callback to run for the event.
-   `timeDelay: number | Function` _(optional)_: How long from now to run the callback (by default, 1).
-   `numRepeats: number | Function` _(optional)_: How many times to run the event (by default, 1).
-   `...args: any[]`: Any additional arguments to pass to the callback.

Adds an event interval, waiting to start until it's in sync with the time delay.

This is useful for starting animations of objects intended to be animated in sync,
like Goombas in Mario or flower scenery in Pokemon.
Otherwise identical to `addEventInterval`.

### `cancelEvent`

Parameters:

-   `event: Object`: Event to cancel.

Cancels an event created by one of the `addEvent*` methods.

```typescript
const timeHandler = new TimeHandlr();

const event = timeHandler.addEvent(() => console.log("Hello world!"), 3);

timeHandler.advance();
timeHandler.advance();

timeHandler.cancelEvent(event);

timeHandler.advance();
```

### `cancelAllEvents`

Cancels all events.

```typescript
const timeHandler = new TimeHandlr();

timeHandler.addEvent(() => console.log("Hello world!"), 3);

timeHandler.advance();
timeHandler.advance();

timeHandler.cancelAllEvents();

timeHandler.advance();
```

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/TimeHandlr
cd TimeHandlr
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
