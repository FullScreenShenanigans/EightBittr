# GroupHoldr
[![Build Status](https://travis-ci.org/FullScreenShenanigans/GroupHoldr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/GroupHoldr)
[![NPM version](https://badge.fury.io/js/groupholdr.svg)](http://badge.fury.io/js/groupholdr)

A general storage abstraction for keyed containers of items.


## Build Process

GroupHoldr uses [Gulp](http://gulpjs.com/) to automate building, which requires [Node.js](http://node.js.org).

To build from scratch, install NodeJS and run the following commands:

```
npm install
gulp
```

### Individual Gulp tasks

* `gulp dist` - Compiles the source into `dist/`. 
* `gulp tsc` - Runs the [TypeScript](https://typescriptlang.org/) compiler.
* `gulp tslint` - Runs [TSLint](https://github.com/palantir/tslint).
* `gulp test` - Runs tests in `tests/`. 
* `gulp watch` - Runs the `tsc` and `tslint` tasks when a source file changes.
