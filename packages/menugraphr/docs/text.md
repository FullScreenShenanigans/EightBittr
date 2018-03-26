# Text

Text within menu dialogs and lists can be displayed with granular controls over paddings and spacing.

## `IMenuSchema`

These options will be used when the menu has a dialog or list added.

### `textPaddingRight`

How much padding there is between the right of the text and the right side of the box.
Text in dialogs will return to the next line instead of crossing the menu's `right` minus `textPaddingRight`.
Defaults to `0` (none) if not provided.
Allowed to be negative.

```typescript
{
    textPaddingRight: 8,
},
```

### `textPaddingX`

How much horizontal padding should be between characters.
Defaults to the `"Text"` Thing prototype's `paddingX` if it exists, or `0` otherwise.
Characters placed next to each other in dialogs and lists will be placed this number of game pixels to the right each subsequent character.

```typescript
{
    textPaddingX: 4,
},
```

### `textPaddingY`

How much vertical padding should be between lines of text.
Defaults to the `"Text"` Thing prototype's `paddingY` if it exists, or `0` otherwise.
Lines of text in dialogs and lists will start this number of game pixels lower each line.

```typescript
{
    textPaddingY: 12,
},
```

### `textSpeed`

How long to delay between placing characters and words.
If `0` or not provided, characters and words will be placed immediately.

Otherwise, each character will wait a `textSpeed` delay before displaying.
Words will wait a `textSpeed` delay before appearing after each other as well, which gives the illusion of spaces between words also adhering to the delay.

### `textXOffset`

Horizontal offset for the text placement area.
All text will be offset horizontally by this amount.

```typescript
{
    textXOffset: 2,
},
```

### `textYOffset`

Vertical offset for the text placement area.
All text will be offset vertically by this amount.

```typescript
{
    textYOffset: -2,
},
```
