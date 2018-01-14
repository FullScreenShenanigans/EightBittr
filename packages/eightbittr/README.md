<!-- {{Top}} -->
# GameStartr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/GameStartr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/GameStartr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/GameStartr)
[![NPM version](https://badge.fury.io/js/gamestartr.svg)](http://badge.fury.io/js/gamestartr)

A bare-bones, highly customizeable game engine for 2D 8-bit games.
<!-- {{/Top}} -->

GameStartr is an in-progress experimental game engine targeted to 8-bit retro 2D games. 
It's got some great features built-in, such as:

* :zap: **Blazing-fast** start times: averaging sub-second on a 3G connection & old laptop _including_ HTML parse and load
    * Lazily-instantiated and -loaded components
    * Lazily-instantiated actor classes with inline POJO sprite declarations
    * ~200KB minified :left_right_arrow: ~50KB gzipped
* :wrench: **Easy scaffolding** for extensible mods, level editors, and random map generation
* :open_hands: **Full touch UI** support with [UserWrappr](https://github.com/FullScreenShenanigans/UserWrappr) and [TouchPassr](https://github.com/FullScreenShenanigans/TouchPassr) 

:x: :warning: _GameStartr isn't production ready or well-supported - you're better off using a more standard game engine._ :warning: :x:

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/GameStartr
cd GameStartr
npm install
npm run setup
npm run verify
```

* `npm run setup` creates a few auto-generated setup files locally.
* `npm run verify` builds, lints, and runs tests.

### Building

```shell
npm run watch
```

Source files are written under `src/` in TypeScript and compile in-place to JavaScript files.
`npm run watch` will directly run the TypeScript compiler on source files in watch mode.
Use it in the background while developing to keep the compiled files up-to-date.

### Running Tests

```shell
npm run test
```

Test files are alongside source files under `src/` and named `*.test.ts?`.
Whenever you add, remove, or rename a `*.test.ts?` file under `src/`, re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
