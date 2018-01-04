<!-- {{Top}} -->
# BabyIoC

[![Greenkeeper badge](https://badges.greenkeeper.io/FullScreenShenanigans/BabyIoC.svg)](https://greenkeeper.io/)
[![Build Status](https://travis-ci.org/FullScreenShenanigans/BabyIoC.svg?branch=master)](https://travis-ci.org/FullScreenShenanigans/BabyIoC)
[![NPM version](https://badge.fury.io/js/babyioc.svg)](http://badge.fury.io/js/babyioc)

Infantile IoC decorator with almost no features.
<!-- {{/Top}} -->

BabyIoC is the smallest IoC container you'll ever see _(about 100 real lines of code!)_.
It's also got the fewest toys - it's only targeted for use by [GameStartr](https://github.com/FullScreenShenanigans/GameStartr).

Key tenants:
* Use TypeScript.
* All `@components` are members of the parent `@container` container class instance.
* Components are stored as lazily evaluated getters: circular dependencies are fine!

## Usage

Each **@component** is a member of your root **@container** class.
Declare your components with their classes to have them automagically created as members of your class.

```typescript
import { component, container } from "babyioc";

class DependencyA { }

@container
class Container {
    @component(DependencyA)
    public readonly dependencyA: DependencyA;
}

const { dependencyA } = new Container();
```

Components receive the instance of the container as a single constructor parameter.
They can use it to reference other components.

```typescript
class DependencyA { }

class DependencyB {
    public constructor(
        public readonly instance: Container,
    ) { }
}

@container
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

If you're using anonymous `() =>` arrow lambdas, because they don't have names, pass in the class name or a string identifier to store them under internally.

```typescript
class DependencyA {
    public constructor(
        public readonly member: string,
    ) { }
}

const createDependencyA = () => new DependencyA("value");

@container
class Container {
    @component(createDependencyA, DependencyA)
    public readonly dependencyA: DependencyA;
}

const { dependencyA } = new Container();
```

These factory functions have access to all the values on the container, including computed getters.

```typescript
class DependencyA {
    public constructor(
        public readonly memberA: string,
    ) { }
}
class DependencyB {
    public constructor(
        public readonly referenceA: DependencyA,
        public readonly valueC: string,
    ) { }
}

const createDependencyA = () => new DependencyA("valueA");

const createDependencyB = (instance: Container) => new DependencyB(dependencyA, container.valueC);

@container
class Container {
    @component(createDependencyA, DependencyA)
    public readonly dependencyA: DependencyA;

    @component(createDependencyB, DependencyB)
    public readonly dependencyB: DependencyB;

    public readonly valueC = "valueC";
}

const { dependencyA, dependencyB } = new Container();
```

...and that's about it!

<!-- {{Development}} -->
## Development

```
git clone https://github.com/FullScreenShenanigans/BabyIoC
cd BabyIoC
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
