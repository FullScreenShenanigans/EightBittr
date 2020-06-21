# AudioPlayr
[![Build Status](https://travis-ci.org/FullScreenShenanigans/AudioPlayr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/AudioPlayr)
[![NPM version](https://badge.fury.io/js/objectmakr.svg)](http://badge.fury.io/js/audioplayr)

An audio playback manager for persistent and on-demand themes and sounds.


## Build Process

AudioPlayr uses [Gulp](http://gulpjs.com/) to automate building, which requires [Node.js](http://node.js.org).

To build from scratch, install NodeJS and run the following commands:

```
npm install -g gulp-cli
npm install
gulp
```

### Individual Gulp tasks

* `gulp dist` - Compiles the source into `dist/`. 
* `gulp tsc` - Runs the [TypeScript](https://typescriptlang.org/) compiler.
* `gulp tslint` - Runs [TSLint](https://github.com/palantir/tslint).
* `gulp test` - Runs tests in `tests/`. 
* `gulp watch` - Runs the `tsc` and `tslint` tasks when a source file changes.
