<!-- Top -->

# TimeHandlr

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/timehandlr.svg)](http://badge.fury.io/js/timehandlr)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

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

This is useful for starting animations of objects intended to be animated in sync, such as Goombas in Mario or flower scenery in Pokemon.
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
