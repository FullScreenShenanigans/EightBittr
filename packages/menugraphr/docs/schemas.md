# Menu Schemas

## `IMenuSchema`

Attributes describing menu appearance and behavior.
These may be specified in the default schemas on a MenuGraphr instance or overriden with `createMenu`.

All properties are optional.

> See [`dialogs.md`](./dialogs.md) for properties specific to menu dialogs.

> See [`lists.md`](./lists.md) for properties specific to menu lists.

> See [`text.md`](./text.md) for properties around displaying text in dialog and list menus.

### `backMenu`

Name of a menu to set as active when this one is deleted.

```typescript
{
    backMenu: "GeneralText",
},
```

### `callback`

Callback for when this menu is set as active.
Called with the menu name.

```typescript
{
    callback: (menuName) => {
        console.log("Set", menuName, "as active.");
    },
},
```

### `childrenSchemas`

Schemas of children to add on creation.
These will be directly passed to `createMenuChild`, which will call `createMenu`, `createMenuWord`, or `createMenuThing` as per the child type.
As with regular menu schemas, these allow all properties as overrides.

```typescript
{
    childrenSchemas: [
        {
            type: "text",
            words: ["Hello", "world!"],
        },
        {
            type: "thing",
            thing: "PlayerPortrait",
            position: {
                horizontal: "right",
            },
        },
        {
            type: "menu",
            name: "PlayerStats",
        },
    ],
},
```

> See `IMenuChildSchema`.

### `container`

Name of a containing menu to position within.
If not provided, this defaults to the entire game canvas.

```typescript
{
    container: "GeneralText",
},
```

### `height`

How tall the menu should be, as Thing height.
This will also set the general Thing height of the menu.

```typescript
{
    height: 80,
},
```

### `ignoreA`

Whether user selection events should be ignored.
These "A" events normally advance menu dialogs forward or trigger selected items in lists.

```typescript
{
    ignoreA: true,
},
```

### `ignoreB`

Whether user deselection events should be ignored.
These "B" events normally exit out of menus.

```typescript
{
    ignoreB: true,
},
```

### `ignoreProgressB`

Whether deselection events should count as selection during dialogs.
Menus with "progress" are in the middle of dialog or list creation.
Pressing B during progress would normally advance the menu forward.

```typescript
{
    ignoreProgressB: true,
},
```

### `keepOnBack`

Whether this should be kept alive when deselected.
Useful for switching active state between multiple menus on B.

```typescript
{
    keepOnBack: true,
},
```

### `killOnB`

Other menus to kill when this is deselected.
Commonly used with "Yes/No"-style dialogs that appear along with text descriptions in other menus.

```typescript
{
    killOnB: ["GeneralText", "OtherDecorations"],
},
```

### `onActive`

Callback for when the menu becomes active.
Receives just the menu name.

```typescript
{
    onActive: (menuName) => {
        console.log("Menu", menuName, "is now active.");
    },
},
```

### `onBPress`

Callback for when the "B" button is pressed while the menu is active.
Receives just the menu name.

Does not fire if `ignoreB` is true.
Also does not fire if the menu is mid-progress and `ignoreProgressB` is not true, as that simulates an "A" press.

```typescript
{
    onBPress: (menuName) => {
        console.log("Menu", menuName, "received a B press.");
    },
},
```

### `onDown`

Callback for when the "down" button is pressed.
Receives just the menu name.

```typescript
{
    onDown: (menuName) => {
        console.log("Menu", menuName, "received a down event.");
    },
},
```

### `onInactive`

Callback for when the menu becomes inactive.
Receives just the menu name.

```typescript
{
    onActive: (menuName) => {
        console.log("Menu", menuName, "is now active.");
    },
},
```

### `onLeft`

Callback for when the "left" button is pressed.
Receives just the menu name.

```typescript
{
    onLeft: (menuName) => {
        console.log("Menu", menuName, "received a left event.");
    },
},
```

### `onMenuDelete`

Callback for when the menu is deleted.
Receives just the menu name.

This is called _after_ the menu is deleted, but _before_ menu children are  deleted.

```typescript
{
    onMenuDelete: (menuName) => {
        console.log("Menu", menuName, "was deleted.");
    },
},
```

### `onRight`

Callback for when the "right" button is pressed.
Receives just the menu name.

```typescript
{
    onRight: (menuName) => {
        console.log("Menu", menuName, "received a right event.");
    },
},
```

### `onUp`

Callback for when the "up" button is pressed.
Receives just the menu name.

```typescript
{
    onUp: (menuName) => {
        console.log("Menu", menuName, "received an up event.");
    },
},
```

### `size`

Sizing description, including `height` and `width`.
This will override the native Thing `height` and `width` on the Menu.

```typescript
{
    size: {
        height: 80,
        width: 40,
    },
},
```

```typescript
{

},
```

> This allows menus to act as containers at a different size from their visual Things.

### `width`

How wide the menu should be, as Thing width.
This will also set the general Thing width of the menu.

```typescript
{
    width: 40,
},
```

### `position`

How the menu should be positioned within its container.
Defaults to the menu aligning itself to the top-left corner of its container and no width or height.

#### `horizontal`

Modifies how the schema lays itself out horizontally.

* If `"center"`, aligns to the horizontal midpoint of its container.
* If `"right"`, its right aligns with its container's right.
* If `"stretch"`, stretches to fit its container horizontally.

```typescript
position: {
    horizontal: "right",
},
```

#### `offset`

Horizontal and vertical offsets to shift the menu by.
These are allowed to be negative numbers, are calculated relative to the menu's container, and each reduce the menu's size horizontally or vertically.

```typescript
position: {
    offset: {
        top: -1,
        right: 2,
        bottom: 3,
        left: -4,
    },
},
```

#### `vertical`

Modifies how the schema lays itself out vertically.

* If `"center"`, aligns to the vertical midpoint of its container.
* If `"bottom"`, its bottom aligns with its container's bottom.
* If `"stretch"`, stretches to fit its container vertically.

```typescript
position: {
    vertical: "bottom",
},
```

