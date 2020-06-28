# Walkthrough

This page will guide you through the steps to create a new game using the EightBittr game engine.
The game will feature a player avoiding boxes bouncing around a screen like an old screensaver and include a basic suite of tests.

> Make sure you've read through the other documentation pages listed in the [EightBittr README.md](../../README.md) before reading this one!

1. [Package Setup](#package-setup)
2. [Game Instantiation](#game-instantiation)
3. [Introducing Things](#introducing-things)
4. [Physics](#physics)
5. [Collisions](#collisions)
6. [Intervals](#intervals)
7. [One Player](#one-player)
8. [Two Players](#two-players)
9. [Data Persistence](#data-persistence)
10. [Tests](#tests)

## Package Setup

Our game will be set up in its own directory as an npm package.
Create a new empty directory on your computer named `FullScreenSaver` and set up that package using `shenanigans-manager bootstrap-package`:

```shell
npx shenanigans-manager bootstrap-package --description "My new fancy game." --dist --mode "external" --name FullScreenSaver --web
```

-   `--description "My new fancy game."`: Description to go in `package.json` and code comments describing the new game class.
-   `--dist`: Whether to include a minified `dist/` version of the game during builds.`
-   `--game`: The package's code should be set up as a game consuming EightBittr.
-   `--mode "external"`: This package will exist on its own, outside the EightBittr repository monorepo.
-   `--name "FullScreenSaver"`: Name of the npm package and new game class.
-   `--web`: The package should be set up with a `lib/index.html` to play the game.

Your `FullScreenSaver` directory will now be set up with basic files to start you coding.
Open your favorite IDE _(recommended: VS Code)_ in that directory.
Prepare it for development by installing packages with `yarn` and starting the TypeScript compiler in watch mode:

```shell
code .
yarn
yarn compile -w
```

At this point you'll now be able to open a generated `lib/index.html` file in your favorite web browser.
It'll contain a heading with the _FullScreenSaver_ title, a big black area where the game renders, and an _Options_ menu on the bottom.
Hooray, it works! 🙌

Let's get started filling out that game.

##
