# Lists

Menus can have scrollable lists of selectable text options in them.
Users can use direction inputs to scroll through the items.

Lists can be one-dimensional or two-dimensional.
This is determined by the computed height of list options within the menu's height.
If enough options are added to a list to pass the bottom, unless the menu specifies `singleColumnList`, they will overflow to a column to the right.

## `IListMenuSchema`

When creating or declaring schemas for list menus, there are some additional properties you can apply to them.
These are all optional.

### `saveIndex`

Whether the last selected index should be saved.
When `true`, the parent GameStartr's ItemsHoldr will save the selected index of the menu under the menu's name.
Recreating the menu will read from that stored index if available.

```typescript
{
    saveIndex: true,
},
```

### `clearedIndicesOnDeletion`

Names of menus whose whose selected indices that should be cleared when this menu is deleted.
Use this when there are multiple related list menus open at once, and finishing one clears another.

```typescript
{
    clearedIndicesOnDeletion: [
        "KeyboardKeys",
        "NameCollection",
    ],
},
```

### `scrollingItems`

How many scrolling items should be visible within the menu vertically.
List menus will by default show all the items at once, which is bad if there are many options and not enough menu height to display them all.
Specify a `scrollingItems` number to hardcode a maximum to display at once.

If the user shifts their selected index to below the lowest displayed item or above the highest displayed item,
the menu will "scroll" items vertically.
It does this by shifting their Things vertically and setting `hidden` on items not allowed to be seen.

```typescript
{
    scrollingItems: 10,
},
```

> There is no equivalent for horizontal items.

### `scrollingItemsComputed`

As an alternative to `scrollingItems`, you can have the maximum displayed number of items computed as a function of menu height and expected height per list option.
This will set the `scrollingItems` member of the menu on list creation.

```typescript
{
    scrollingItemsComputed: true,
},
```

### `singleColumnList`

Whether the list should always be a single column, rather than auto-flow.

```typescript
{
    singleColumnList: true,
},
```

## `addMenuList`

Adds a list of text options to a menu.

Parameters:

* `menuName`: Name of the menu.
* `settings`: Settings for the list, particularly its options.

### `IListMenuOption`

Individual option within a list.
Only `text` is required.

#### `callback`

Callback for when the option is triggered.
Receives just the menu name.

```typescript
{
    options: [
        {
            callback: () => console.log("First!"),
            text: "First",
        },
    ],
},
```

#### `position`

Position offsets to shift the option by, allowing top, right, bottom, left.

```typescript
{
    options: [
        {
            position: {
                top: 30,
                right: -20,
            },
            text: "First",
        },
    ],
},
```

#### `text`

Text displayed as the option.
This text will be rendered all in one row, similar to dialogs.


### `IListMenuOptions`

Settings to create a new list menu.
Only 

#### `bottom`

A bottom option to display underneath displayed options.
If the list is two-dimensional, this will span across all rows.

```typescript
{
    bottom: {
        callback: () => console.log("Cancelled."),
        text: "Cancel",
    },
},
```

#### `options`

Options within the menu, or a function to generate them.
This is a flat list of options regarldess of whether the menu is one- or two-dimensional.

```typescript
{
    options: [
        {
            callback: () => console.log("First!"),
            text: "First",
        },
    ],
},
```

See `IListMenuOption` above.

#### `selectedIndex`

Each list contains a `selectedIndex: [number, number]` of the position of the currently selected index.
This option overrides the starting selected index.
It defaults to `[0, 0]`.

## Examples

Showing a simple "Yes/No" menu after a general text dialog that stays alive:

```typescript
const finalize = (choice) => {
    console.log("Choice:", choice);
    menuGrapher.deleteMenu("Yes/No");
};

const createOptions = () => {
    menuGrapher.createMenu("Yes/No", {
        killOnB: ["GeneralText"],
    });

    menuGrapher.addMenuList("Yes/No", {
        options: [
            {
                text: "YES",
                callback: () => finalize(true),
            },
            {
                text: "NO",
                callback: () => finalize(false),
            }
        ],
    });

    menuGrapher.setActiveMenu("Yes/No");
};

menuGrapher.createMenu("GeneralText", {
    finishAutomatically: true,
    keepOnBack: true,
});
menuGrapher.addMenuDialog("GeneralText", "Are you sure?", createOptions);
menuGrapher.setActiveMenu("GeneralText");
```
