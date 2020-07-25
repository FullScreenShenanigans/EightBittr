<!-- Top -->

# BabyIoc

[![Code Style: Prettier](https://img.shields.io/badge/code_style-prettier-brightgreen.svg)](https://prettier.io)
![TypeScript: Strict](https://img.shields.io/badge/typescript-strict-brightgreen.svg)
[![NPM version](https://badge.fury.io/js/babyioc.svg)](http://badge.fury.io/js/babyioc)
[![Join the chat at https://gitter.im/FullScreenShenanigans/community](https://badges.gitter.im/FullScreenShenanigans/community.svg)](https://gitter.im/FullScreenShenanigans/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Infantile IoC decorator with almost no features.

<!-- /Top -->

BabyIoC is the smallest IoC container you'll ever see _(under 50 lines of code!)_.
It's also got the fewest toys - it's only targeted for use by [EightBittr](https://github.com/FullScreenShenanigans/EightBittr).

Key tenants:

-   All `@member`s are literally members of the container class instance.
-   Members are stored as lazily evaluated getters: circular dependencies are fine!
-   Use TypeScript.

## Usage

Each **@member** is a literal member of your container class.
Declare your members with their classes to have them automagically created as members of your class.

```typescript
import { member } from "babyioc";

class DependencyA {}

class Container {
    @member(DependencyA)
    public readonly dependencyA: DependencyA;
}

const { dependencyA } = new Container();
```

Members receive the instance of the container as a single constructor parameter.
They can use it to reference other members.

```typescript
import { member } from "babyioc";

class DependencyA {}

class DependencyB {
    public constructor(public readonly instance: Container) {}
}

class Container {
    @member(DependencyA)
    private readonly dependencyA: DependencyA;

    @member(DependencyB)
    public readonly dependencyB: DependencyB;
}

const { dependencyB } = new Container();
const { dependencyA } = depdendencyB.instance;
```

### Factories

Your members don't have to be direct classes with dependencies.
Pass functions that take in your container as an argument.
The values returned by those functions are used as the member value.

Use `factory` instead of `member` for these.

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
    public constructor(public readonly referenceA: DependencyA, public readonly valueC: string) {}
}

const createDependencyA = () => new DependencyA("valueA");

const createDependencyB = (instance: Container) => new DependencyB(dependencyA, container.valueC);

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

Marking a member with `@member` or `@factory` creates a double-layer getter on the class prototype.
The prototype will have a getter defined that writes a getter on the calling object.
Both getters return a new instance of the member.

For example, with this member:

```typescript
import { member } from "babyioc";

class Dependency {}

class Container {
    @member(Dependency)
    public readonly myDependency: Dependency;
}
```

`Container.prototype` has a getter defined on `"myDependency"` that creates a `new Dependency(this)` and writes a getter on the calling scope's `"myDependency"` to return it.
In practical use, that means the first getter will stay on `Container.prototype`, and the calling scope that receives the second getter will generally be an instance of the `Container` class.

See [`index.ts`](src/index.ts).

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

## Philosophy

### Is BabyIoC an IoC framework?

If you consider the `Container` classes from the samples to be equivalent to IoC containers à la [Inversify](http://inversify.io), then sure.
The main difference is that members are encouraged to have knowledge of the full application type instead of just their dependencies.

### Is BabyIoC a **good** IoC framework?

Lol, no.

Application members generally shouldn't have knowledge of the full application.
BabyIoC also has almost no features.
You should probably use something standard like [Inversify](http://inversify.io).

### Does BabyIoC violate [SOLID principles](<https://en.wikipedia.org/wiki/SOLID_(object-oriented_design)>)?

Debatably no.

There's noactor inherently non-SOLID in members being passed the root IoC container.
Such a actor happens behind the scenes in normal IoC frameworks; BabyIoC members just don't have the layer of indirection given by declaring only required parameters.
Just as BabyIoC members can access anyactor they want, so too can traditional classes by taking in an obscene number of dependencies.
