# Frequently Asked Questions

## Should I Use EightBittr?

If you have to ask... then no.
Hard no.

This is a personal project with no virtually no developer support.
Maybe in a few years it'll be production ready.
Probably not.

## How Do I Store State In Game?

Use the core ItemsHoldr.
Modules should generally only keep caches for their internal members, and sections should not have any game state.

## Why So Much Class Inheritance?

> Or: doesn't forcing sections to inherit classes violate [SOLID principles](https://en.wikipedia.org/wiki/SOLID)?

Arguably no.
From one perspective, enforcing a rigid inheritance hierarchy here actually _helps_ enforce the [Open-Closed Principle](https://en.wikipedia.org/wiki/Open%E2%80%93closed_principle).
EightBittr sections are managed in a framework that sets up their dependencies and lifecycle.
Classes in the EightBittr structure have defined purposes and, while they may be extended within their purposes, may not be drastically altered.

## What Needs to Happen Before 1.0?

> Todo: attach GitHub issue links!

Quite a lot!

### Documentation

-   Each package should have a fleshed out README.md, including usage examples.
-   EightBittr should provide a walkthrough of how to set up the major areas of games (e.g. collisions, graphics, maps, ...).

### Infrastructure

-   Move WorldSeedr out of core and into its own package.
-   Invest in LevelEditr and SpriteMakr as their own packages.

### Tests

-   Fill in unit testing gaps for all packages.
-   Add rudimentary test coverage metrics.

### Things

-   Rename `Thing` to `Actor`, including `ThingHittr` to `ActorHittr`. It's more industry common and doesn't have the weird connotations of `Thing`... 🤦‍♀️
-   Move relevant portions of Things into members (e.g. `.box` for physics settings), so that modules can _compose_ rather than _inherit_.
    -   This is likely also good for performance!

### UI

-   Use modern React _(hooks!)_ for LevelEditr, SpriteMakr, TouchPassr, and UserWrappr.
