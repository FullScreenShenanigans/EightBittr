<!-- Top -->

# BabyIoC

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/BabyIoC.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/BabyIoC.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/BabyIoC)
[![NPM version](https://badge.fury.io/js/babyioc.svg)](http://badge.fury.io/js/babyioc)

Infantile IoC decorator with almost no features.

<!-- /Top -->

BabyIoC is the smallest IoC container you'll ever see _(under 50 lines of code!)_.
It's also got the fewest toys - it's only targeted for use by [GameStartr](https://github.com/FullScreenShenanigans/GameStartr).

Key tenants:

-   All `@component`s are members of the container class instance.
-   Components are stored as lazily evaluated getters: circular dependencies are fine!
-   Use TypeScript.

## Usage

Each **@component** is a member of your container class.
Declare your components with their classes to have them automagically created as members of your class.

```typescript
import { component } from "babyioc";

class DependencyA {}

class Container {
    @component(DependencyA)
    public readonly dependencyA: DependencyA;
}

const { dependencyA } = new Container();
```

Components receive the instance of the container as a single constructor parameter.
They can use it to reference other components.

```typescript
import { component } from "babyioc";

class DependencyA {}

class DependencyB {
    public constructor(public readonly instance: Container) {}
}

class Container {
    @component(DependencyA)
    private readonly dependencyA: DependencyA;

    @component(DependencyB)
    public readonly dependencyB: DependencyB;
}

const { dependencyB } = new Container();
const { dependencyA } = depdendencyB.instance;
```

### Factories

Your components don't have to be direct classes with dependencies.
Pass functions that take in your container as an argument.
The values returned by those functions are used as the component value.

Use `factory` instead of `component` for these.

```typescript
import { factory } from "babyioc";

class DependencyA {
    public constructor(public readonly member: string) {}
}

const createDependencyA = () => new DependencyA("value");

class Container {
    @factory(createDependencyA)
    public readonly dependencyA: DependencyA;
}

const { dependencyA } = new Container();
```

These factory functions have access to all the values on the container, including computed getters.

```typescript
import { factory } from "babyioc";

class DependencyA {
    public constructor(public readonly memberA: string) {}
}
class DependencyB {
    public constructor(
        public readonly referenceA: DependencyA,
        public readonly valueC: string
    ) {}
}

const createDependencyA = () => new DependencyA("valueA");

const createDependencyB = (instance: Container) =>
    new DependencyB(dependencyA, container.valueC);

class Container {
    @factory(createDependencyA)
    public readonly dependencyA: DependencyA;

    @factory(createDependencyB)
    public readonly dependencyB: DependencyB;

    public readonly valueC = "valueC";
}

const { dependencyA, dependencyB } = new Container();
```

...and that's about it!

## Technical Details

Marking a member with `@component` or `@factory` creates a double-layer getter on the class prototype.
The prototype will have a getter defined that writes a getter on the calling object.
Both getters return a new instance of the component.

For example, with this component:

```typescript
import { component } from "babyioc";

class Dependency {}

class Container {
    @component(Dependency)
    public readonly myDependency: Dependency;
}
```

`Container.prototype` has a getter defined on `"myDependency"` that creates a `new Dependency(this)` and writes a getter on the calling scope's `"myDependency"` to return it.
In practical use, that means the first getter will stay on `Container.prototype`, and the calling scope that receives the second getter will generally be an instance of the `Container` class.

See [`index.ts`](src/index.ts).

<!-- Development -->

## Development

After [forking the repo from GitHub](https://help.github.com/articles/fork-a-repo/):

```
git clone https://github.com/<your-name-here>/BabyIoC
cd BabyIoC
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

## Philosophy

### Is BabyIoC an IoC framework?

If you consider the `Container` classes from the samples to be equivalent to IoC containers à la [Inversify](http://inversify.io), then sure.
The main difference is that components are encouraged to have knowledge of the full application type instead of just their dependencies.

### Is BabyIoC a **good** IoC framework?

Lol, no.

Application components generally shouldn't have knowledge of the full application.
BabyIoC also has almost no features.
You should probably use something standard like [Inversify](http://inversify.io).

### Does BabyIoC violate [SOLID principles](<https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)>)?

Debatably no.

There's nothing inherently non-SOLID in components being passed the root IoC container.
Such a thing happens behind the scenes in normal IoC frameworks; BabyIoC components just don't have the layer of indirection given by declaring only required parameters.
Just as BabyIoC components can access anything they want, so too can traditional classes by taking in an obscene number of dependencies.
