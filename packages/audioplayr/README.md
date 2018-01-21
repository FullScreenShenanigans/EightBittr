<!-- {{Top}} -->
# AudioPlayr
[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/AudioPlayr.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/AudioPlayr.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/AudioPlayr)
[![NPM version](https://badge.fury.io/js/audioplayr.svg)](http://badge.fury.io/js/audioplayr)

An audio playback manager for persistent and on-demand themes and sounds.
<!-- {{/Top}} -->

## Usage

### Constructor

```typescript
import { AudioPlayr } from "audioplayr";

const audioPlayer = new AudioPlayr();

audioPlayer.play("Hello world.mp3");
```

#### `nameTransform`

By default, provided names are treated as the `src` file names for their sounds.
You can define a mapping of names to file names by providing a `nameTransform` method.
It should take in a `string` and return a `string`.

```typescript
const audioPlayer = new AudioPlayr({
    nameTransform: (name: string) => `Sounds/${name}.mp3`,
});

// Plays "Sounds/Hello world.mp3"
audioPlayer.play("Hello world");
```

Internally, all sound names will be transformed with the `nameTransform`.

#### `storage`

By default, mute and volume settings aren't kept from state to state.
You can pass a `storage` parameter to an `AudioPlayr` to keep them locally.
It should be an object with `getItem(name: string): string` and `setItem(name: string, value: string)` members, such as `localStorage`.

```typescript
const audioPlayer = new AudioPlayr({
    storage: localStorage,
});
```

Keys that may be stored are:

* `"muted"`: Whether sounds are muted.
* `"volume"`: Global sound volume.

See [`Storage.ts`](./src/Storage.ts) for the `AudioSetting` enum and `IAudioSettingsStorage` interface.

### `play`

Parameters:

* `name: string`: Name of the audio file, used as its `src`.
* `settings: Object` _(optional)_: Any additional options.

Returns: `Promise<void>` for _starting_ playback.

```typescript
audioPlayer.play("beep.mp3");
```

If the same audio name is played twice, the first will be stopped before the second starts.

```typescript
audioPlayer.play("beep.mp3");
// ...
audioPlayer.play("beep.mp3");
```

`settings` may contain any of the following keys:

* `alias`:
    Changes what name the sound will be stored under.
    Defaults to the given name.

    As with `play`, if two sounds with the same `alias` are played, the first will be stopped before the second starts.

    ```typescript
    audioPlayer.play("Overworld.mp3", { alias: "Theme" });
    // ...
    audioPlayer.play("Underworld.mp3", { alias: "Theme" });
    ```

    If a `nameTransform` was provided, it's applied to this alias as well.

* `loop`:
    Whether the sound should loop continuously.
    Defaults to `false`.

    ```typescript
    audioPlayer.play("Bloop.mp3", { loop: true });
    ```

* `muted`:
    Whether the sound should be muted.
    Defaults to `false`.

    ```typescript
    audioPlayer.play("Boop.mp3", { muted: true });
    ```

    If the `AudioPlayr` is globally muted, `muted: false` will be ignored.

* `volume`:
    Volume as a number in `[0, 1]`.
    Defaults to `1`.

    ```typescript
    audioPlayer.play("Bop.mp3", { volume: 0.5 });
    ```

    The sound's playing volume is computed as this times the global volume.

### `getMuted`

Returns: `boolean` for whether all sounds are muted.

### `getVolume`

Returns: `number` in `[0, 1]` for global sound volume.

### `setMuted`

Parameters:

* `muted: boolean`: Whether this all sounds are globally muted.

Returns: `Promise<void>` for setting whether all sounds are globally muted.

### `setVolume`

Parameters:

* `volume: number`: `number` in `[0, 1]` for global sound volume.

Returns: `Promise<void>` for setting the global sound volume.

### `pauseAll`

Returns: `Promise<void>` for pausing all sounds.

Pauses all sounds in parallel.
This only affects sounds that are playing.

### `resumeAll`

Returns: `Promise<void>` for resuming all sounds.

Resumes all sounds in parallel.
This only affects sounds that are paused.

### `stopAll`

Returns: `Promise<void>` for stopping all sounds.

Stops all sounds.
Any individual sound settings are cleared.

## `hasSound`

Parameters:

* `alias: string`: Alias to check under.
* `name: string` _(optional)_: Name the sound must have, if not the same as `alias`. 

Returns: `boolean` for whether a sound exists under the alias.

<!-- {{Development}} -->
## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/AudioPlayr
cd AudioPlayr
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
Whenever you add, remove, or rename a `*.test.t*` file under `src/`, `watch` will re-run `npm run test:setup` to regenerate the list of static test files in `test/index.html`.
You can open that file in a browser to debug through the tests.
`npm run test:run` will run that setup and execute tests using [Puppeteer](https://github.com/GoogleChrome/puppeteer).
<!-- {{/Development}} -->
