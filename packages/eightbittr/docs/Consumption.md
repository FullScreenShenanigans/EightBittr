# Consumption

## Creating New Components

Declaring a new component in an inheriting class should look roughly the same as how they're structured in EightBittr's source.
Declare your module creation factories and section classes in your own game's code.

> See **[./Architecture.md](./Architecture.md)** for their documentation.

## Extending Core Sections

You can generally provide members to a core section by sub-classing it and redeclaring its root game member on your own class.
The sub-class will need to declare its game class as the parent section's `Game` template type.

For example, to create an `Audio` section with an overridden `nameTransform`, first declare the class in its own file:

```ts
import { Audio as AudioBase } from "eightbittr";

import { MyGame } from "../MyGame";

export class Audio<Game extends MyGame> extends AudioBase<FullScreenSaver> {
    public readonly nameTransform = (name: string): string => `sounds/${name}.mp3`;
}
```

...then redeclare it as a member on your game class:

```ts
import { member } from "autofieldr";
import { EightBittr } from "eightbittr";

import { Audio } from "./components/Audio";

export class MyGame extends EightBittr {
    @member(Audio)
    public readonly audio: Audio;
}
```

## Extending Core Modules

Core modules are generally created using the `public readonly` members of core sections.
You can provide them your own values by extending the core section classes as described above.
