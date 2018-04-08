# Dialogs

Menu dialogs refer to any amount of text on a menu.
Some dialogs are static, and just used to display text Things on top of a menu.
Others are dynamic and can advance through formatted lines of interactive text.

## `addMenuDialog`

Adds dialog-style text to a menu.
If the text would overflow the menu's size, excess horizontal lines are delayed.
The user can advance through the menu with "A" button presses.

Parameters:

* `menuName`: Name of the menu.
* `dialog`: Raw dialog to add to the menu, as strings, arrays of strings, or complex placement commands.
* `onCompletion`: Optional callback for when the text is done.

### Dialogs

The actual type for menu dialogs is weirdly flexible:

```typescript
type IMenuDialogRaw = string | (string | string[] | (string | string[])[] | IMenuWordCommandBase)[];
```

#### String Dialogs

The simplest dialogs will typically just contain strings:
When provided as a raw string, the dialog is split across whitespace to generate words.
This forces the dialog to not wrap words across lines.

```typescript
// Creates a new GeneralText menu, deleting any existing one
menuGrapher.createMenu("GeneralText");

// Adds the dialog to GeneralText
menuGrapher.addMenuDialog("GeneralText", "Hello world!");

// Sets GeneralText as the active, input-receiving menu
menuGrapher.setActiveMenu("GeneralText");
```

#### Array Dialogs

Dialogs will show as many consecutive lines on "A" press as possible by default.
You can force a "break" in the sections by providing an array of dialog strings.
The dialog will clear any lines on the screen when moving across a break.

```typescript
menuGrapher.addMenuDialog("GeneralText", ["Hello world!", "Me again!"]);
```

### Advanced Commands

It's allowed to provide advanced "commands" to dialogs along with words in the dialogs.
These commands can insert "floating" text or change position offsets or alignments of the dialog text.

Alas, these command types aren't well fleshed out in `IMenuGraphr.ts` and not recommended until documentation is solidified.
See [#52](https://github.com/FullScreenShenanigans/MenuGraphr/issues/52).

## `IMenuSchema`

These options are available on `IMenuSchema` generally, but only useful once the menu is given a dialog.

### `deleteOnFinish`

Whether the menu should be deleted when its dialog finishes.

```typescript
{
    deleteOnFinish: true,
}
```

### `finishAutomatically`

Whether the dialog should finish when the last word is displayed,
instead of waiting for user input.

```typescript
{
    finishAutomatically: true,
},
```

### `finishAutomaticSpeed`

How many game ticks to delay completion by when `finishAutomatically` is true.
Defaults to `0`.

```typescript
{
    finishAutomaticSpeed: 100,
}
```

### `finishLinesAutomatically`

Whether individual lines of dialog should finish when the last word is displayed,
instead of waiting for user input.

```typescript
{
    finishLinesAutomatically: true,
},
```

### `finishLinesAutomaticSpeed`

How many game ticks to delay completion by when `finishLinesAutomatically` is true.
Defaults to `0`.

```typescript
{
    finishLinesAutomaticSpeed: 100,
}
```

See [`lists.md`](./lists.md) for examples of lists intermixed with dialogs.
