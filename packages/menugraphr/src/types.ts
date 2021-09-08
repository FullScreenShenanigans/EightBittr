import { EightBittr, Actor } from "eightbittr";

/**
 * General attributes for both Menus and MenuSchemas.
 */
export interface MenuBase {
    /**
     * Name of a menu to set as active when this one is deleted.
     */
    backMenu?: string;

    /**
     * Callback for when this menu is set as active.
     */
    callback?(menuName: string): void;

    /**
     * Schemas of children to add on creation.
     */
    childrenSchemas?: MenuChildSchema[];

    /**
     * Name of a containing menu to position within.
     */
    container?: string;

    /**
     * Whether this should be deleted when its dialog finishes.
     */
    deleteOnFinish?: boolean;

    /**
     * Whether the dialog should finish when the last word is displayed, instead
     * of waiting for user input.
     */
    finishAutomatically?: boolean;

    /**
     * How many game ticks to delay completion by when finishAutomatically is true.
     */
    finishAutomaticSpeed?: number;

    /**
     * Whether the dialog should immediately progress when a line has reached the bottom,
     * instead of waiting for user input.
     */
    finishLinesAutomatically?: boolean;

    /**
     * How many game ticks to delay progression by when finishAutomatically is true.
     */
    finishLinesAutomaticSpeed?: number;

    /**
     * How tall this should be.
     */
    height?: number;

    /**
     * Whether user selection events should be ignored.
     */
    ignoreA?: boolean;

    /**
     * Whether user deselection events should be ignored.
     */
    ignoreB?: boolean;

    /**
     * Whether deselection events should count as selection during dialogs.
     */
    ignoreProgressB?: boolean;

    /**
     * Whether this should be kept alive when deselected.
     */
    keepOnBack?: boolean;

    /**
     * Other menus to delete when this is deleted.
     */
    killOnB?: string[];

    /**
     * Callback for when this becomes active.
     */
    onActive?(menuName: string): void;

    /**
     * Callback for when the "B" button is pressed.
     */
    onBPress?(menuName: string): void;

    /**
     * Callback for when the "down" button is pressed.
     */
    onDown?(menuName: string): void;

    /**
     * Callback for when this becomes inactive.
     */
    onInactive?(menuName: string): void;

    /**
     * Callback for when the "left" button is pressed.
     */
    onLeft?(menuName: string): void;

    /**
     * Callback for when this is deleted.
     */
    onMenuDelete?(game: EightBittr): void;

    /**
     * Callback for when the "right" button is pressed.
     */
    onRight?(game: EightBittr): void;

    /**
     * Callback for when the "up" button is pressed.
     */
    onUp?(game: EightBittr): void;

    /**
     * Sizing description for this, including width and height.
     */
    size?: MenuSchemaSize;

    /**
     * How much padding there is between the right of the text and the right side of the box.
     */
    textPaddingRight?: number;

    /**
     * How much horizontal padding should be between characters.
     */
    textPaddingX?: number;

    /**
     * How much vertical padding should be between characters.
     */
    textPaddingY?: number;

    /**
     * How long to delay between placing characters and words.
     */
    textSpeed?: number;

    /**
     * Horizontal offset for the text placement area.
     */
    textXOffset?: number;

    /**
     * Vertical offset for text placement area.
     */
    textYOffset?: number;

    /**
     * How wide this should be.
     */
    width?: number;
}

/**
 * Existing menus, listed by name.
 */
export interface MenusContainer {
    [i: string]: Menu;
}

/**
 * A general Text Actor.
 */
export interface Text extends Actor {
    /**
     * How much vertical padding this Actor requires.
     */
    paddingY: number;
}

/**
 * Known menu schemas, keyed by name.
 */
export interface MenuSchemas {
    [i: string]: MenuSchema;
}

/**
 * A schema to specify creating a menu.
 */
export interface MenuSchema extends MenuBase {
    /**
     * How the menu should be positioned within its container.
     */
    position?: MenuSchemaPosition;
}

/**
 * A schema to specify creating a list menu.
 */
export interface ListMenuSchema extends MenuSchema {
    /**
     * Whether the last selected index should be saved.
     */
    saveIndex?: boolean;

    /**
     * Whether to register the "A" key on every index shift.
     */
    selectIndex?: boolean;

    /**
     * Names of menus whose whose selected indices that should be cleared when this menu is deleted.
     */
    clearedIndicesOnDeletion?: string[];

    /**
     * How many scrolling items should be visible within the menu.
     */
    scrollingItems?: number;

    /**
     * Whether scrolling items should be computed on creation.
     */
    scrollingItemsComputed?: boolean;

    /**
     * Whether the list should always be a single column, rather than auto-flow.
     */
    singleColumnList?: boolean;
}

/**
 * A description of how wide and tall a menu should be.
 */
export interface MenuSchemaSize {
    /**
     * How wide the menu should be.
     */
    width?: number;

    /**
     * How tall the menu should be.
     */
    height?: number;
}

/**
 * Modifies how a schema lays itself out horizontally.
 */
export type SchemaPositionHorizontalModifier = "center" | "right" | "stretch";

/**
 * Modifies how a schema lays itself out vertically.
 */
export type SchemaPositionVerticalModifier = "center" | "bottom" | "stretch";

/**
 * A description of how a meny should be positioned within its container.
 */
export interface MenuSchemaPosition {
    /**
     * Modifies how the schema lays itself out horizontally.
     */
    horizontal?: SchemaPositionHorizontalModifier;

    /**
     * Horizontal and vertical offsets to shift the menu by.
     */
    offset?: MenuSchemaPositionOffset;

    /**
     * Modifies how the schema lays itself out vertically.
     */
    vertical?: SchemaPositionVerticalModifier;
}

/**
 * Horizontal and vertical offsets to shift the menu by.
 */
export interface MenuSchemaPositionOffset {
    /**
     * How far to shift the menu vertically from the top.
     */
    top?: number;

    /**
     * How far to shift the menu horizontally from the right.
     */
    right?: number;

    /**
     * How far to shift the menu vertically from the bottom.
     */
    bottom?: number;

    /**
     * How far to shift the menu horizontally from the left.
     */
    left?: number;
}

/**
 * A description of a menu child to create, including name and child type.
 */
export type MenuChildSchema = MenuChildMenuSchema | MenuWordSchema | MenuActorSchema;

/**
 * A description of a menu to create as a menu child.
 */
export interface MenuChildMenuSchema {
    /**
     * Menu attributes to pass to the menu.
     */
    attributes?: MenuSchema;

    /**
     * The name of the menu.
     */
    name: string;

    /**
     * What type of child this is.
     */
    type: "menu";
}

/**
 * A descripion of a word to create as a menu child.
 */
export interface MenuWordSchema {
    /**
     * How to position the word within the menu.
     */
    position?: MenuSchemaPosition;

    /**
     * A description of the word area's size.
     */
    size?: MenuSchemaSize;

    /**
     * What type of child this is.
     */
    type: "text";

    /**
     * Raw words to set as the text contents.
     */
    words: (string | string[] | MenuWordCommand)[];
}

/**
 * A description of an Actor to create as a menu child.
 */
export interface MenuActorSchema {
    /**
     * Arguments to proliferate onto the Actor.
     */
    args?: any;

    /**
     * How to position the Actor within the menu.
     */
    position?: MenuSchemaPosition;

    /**
     * A description of the Actor's size.
     */
    size?: MenuSchemaSize;

    /**
     * What Actor title to create.
     */
    actor: string;

    /**
     * What type of child this is.
     */
    type: "actor";
}

/**
 * Various raw forms of dialog that may be used. A single String is common
 * for short dialogs, and longer ones may use a String for each word or character,
 * as well as filtered Objects.
 */
export type MenuDialogRaw =
    | string
    | (string | string[] | (string | string[])[] | MenuWordCommandBase)[];

/**
 * A general word and/or command to use within a text dialog.
 */
export interface MenuWordCommandBase {
    /**
     * How many characters long the word is.
     */
    length?: number | string;

    /**
     * The actual word to place, if this is a text
     */
    word?: string;
}

/**
 * Command names to modify dialogs within text.
 */
export type MenuWordCommandName = "attribute" | "attributeReset" | "padLeft" | "position";

/**
 * A word command to modify dialog within its text.
 */
export interface MenuWordCommand extends MenuWordCommandBase {
    /**
     * An attribute to change, if this is an attribute change command.
     */
    attribute: string;

    /**
     * Command name identifier.
     */
    command: MenuWordCommandName;

    /**
     * A value for the attribute to change, if this is an attribute change command.
     */
    value: any;
}

/**
 * A pad left command to add a word with padding.
 */
export interface MenuWordPadLeftCommand extends MenuWordCommandBase {
    /**
     * Whether the amount of padding should be reduced by the word length.
     */
    alignRight?: boolean;
}

/**
 * A word command to reset an attribute after an attribute change command.
 */
export interface MenuWordReset extends MenuWordCommandBase {
    /**
     * The name of the attribute to reset.
     */
    attribute: string;
}

/**
 * A word command to shift the position to add subsequent words.
 */
export interface MenuWordPosition extends MenuWordCommandBase {
    /**
     * How far to shift horizontally.
     */
    x?: number;

    /**
     * How far to shift vertically.
     */
    y?: number;
}

/**
 * A Menu Actor, with any number of children.
 */
export interface Menu extends Actor, MenuSchema {
    /**
     * Child Actors visible within the Menu.
     */
    children: Actor[];

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Common additional name to reference the menu by.
     */
    name: string;

    /**
     * A manual width for the area text may be placed in.
     */
    textAreaWidth?: number;

    /**
     * How tall text characters should be treated as.
     */
    textHeight?: number;

    /**
     * A manual starting x-location for dialog text.
     */
    textStartingX?: string;

    /**
     * Where text should start displaying, horizontally.
     */
    textX?: number;

    /**
     * How wide text characters should be treated as.
     */
    textWidth?: number;

    /**
     * How wide this is.
     */
    width: number;
}

/**
 * Base grid attributes for a list menu.
 */
export interface ListMenuBase {
    /**
     * The grid of options, as columns containing rows.
     */
    grid: GridCell[][];

    /**
     * How many columns are available in the grid.
     */
    gridColumns: number;

    /**
     * How many rows are available in the grid.
     */
    gridRows: number;

    /**
     * All options available in the grid.
     */
    options: GridCell[];

    /**
     * The currently selected [column, row] in the grid.
     */
    selectedIndex: [number, number];
}

/**
 * A menu containing some number of options as cells in a grid.
 */
export interface ListMenu extends ListMenuBase, ListMenuSchema, Menu {
    /**
     * Arrow Actor indicating the current selection.
     */
    arrow: Actor;

    /**
     * Horizontal offset for the arrow Actor.
     */
    arrowXOffset?: number;

    /**
     * Vertical offset for the arrow Actor.
     */
    arrowYOffset?: number;

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Descriptions of the options, with their grid cell and Actors.
     */
    optionChildren: any[];

    /**
     * Class names for the menu's arrow when active or inactive, it it shouldn't be hidden when inactive.
     */
    preserveArrow?: ListMenuPreserveArrow;

    /**
     * A summary of the menu's progress through its list.
     */
    progress: ListMenuProgress;

    /**
     * How many rows the menu has visually scrolled.
     */
    scrollingVisualOffset?: number;

    /**
     * How wide each column of text should be in the grid, if not text width.
     */
    textColumnWidth?: number | number[];

    /**
     * How wide this is.
     */
    width: number;
}

/**
 * A single option within a list menu's grid.
 */
export interface GridCell {
    /**
     * A callback for selecting this cell with a user selection event.
     */
    callback?(...args: any[]): void;

    /**
     * The column containing this option.
     */
    column: GridCell[];

    /**
     * What number column contains this option.
     */
    columnNumber: number;

    /**
     * This option's index within all grid options.
     */
    index: number;

    /**
     * What number row contains this option.
     */
    rowNumber: number;

    /**
     * Text to display to represent this option.
     */
    text: (string | MenuWordCommand)[];

    /**
     * Optionally, an equivalent title that represents this option.
     */
    title?: string;

    /**
     * Floating texts that should be added with the option.
     */
    textsFloating?: any;

    /**
     * Actors that visually represent this option.
     */
    actors: Actor[];

    /**
     * Optionally, some value represented by this option.
     */
    value?: any;

    /**
     * A horizontal left edge for this option's area.
     */
    x: number;

    /**
     * A vertical top edge for this option's area.
     */
    y: number;
}

/**
 * Callback for when a list menu option is triggered.
 *
 * @param menuName   Name of the containing menu.
 */
export type ListMenuOptionCallback = (menuName: string) => void;

/**
 * Single text option in a list.
 */
export interface ListMenuOption {
    /**
     * Callback for when the option is triggered.
     */
    callback?: ListMenuOptionCallback;

    /**
     * Horizontal and vertical offsets to shift the option by.
     */
    position?: MenuSchemaPositionOffset;

    /**
     * Text displayed as the option.
     */
    text: MenuDialogRaw;
}

/**
 * Settings to create a new list menu.
 */
export interface ListMenuOptions {
    /**
     * A bottom option to place below all grid options.
     */
    bottom?: ListMenuOption;

    /**
     * Options within the menu, or a function to generate them.
     */
    options: ListMenuOption[] | (() => ListMenuOption[]);

    /**
     * A default starting selected index.
     */
    selectedIndex?: [number, number];
}

/**
 * Class names for the menu's arrow when active or inactive, it it shouldn't be hidden when inactive.
 */
export interface ListMenuPreserveArrow {
    /**
     * Class name to add to the arrow when the menu is active.
     */
    classActive: string;

    /**
     * Class name to add to the arrow when the menu is inactive.
     */
    classInactive: string;
}

/**
 * A summary of the menu's progress through its list.
 */
export interface ListMenuProgress {
    /**
     * Whether the dialog has been completed.
     */
    complete?: boolean;

    /**
     * Callback for when the dialog completes.
     */
    onCompletion?(...args: any[]): void;

    /**
     * The current words in the list.
     */
    words: any;

    /**
     * Whether the dialog is currently being added to the menu.
     */
    working?: boolean;

    /**
     * The index of the currently selected option.
     */
    i: any;

    /**
     * The horizontal position of the currently selected option.
     */
    x: any;

    /**
     * The vertical position of the currently selected option.
     */
    y: any;
}

/**
 * Sounds that should be played for certain menu actions.
 */
export interface SoundEvents {
    /**
     * The sound to play, if any, when interacting with a menu (usually off the A
     * or B buttons being registered).
     */
    onInteraction?: () => void;
}

/**
 * Alternate Actor titles for characters, such as " " to "space".
 */
export interface Aliases {
    [i: string]: string;
}

/**
 * Programmatic replacements for deliniated words.
 */
export interface Replacements {
    [i: string]: string[] | ReplacerFunction;
}

/**
 * A Function to generate a word replacement based on the EightBitter's state.
 */
export type ReplacerFunction = (game: EightBittr) => string[];

/**
 * Settings to initialize a new MenuGraphr.
 */
export interface MenuGraphrSettings {
    /**
     * The parent EightBittr managing Actors.
     */
    game: EightBittr;

    /**
     * Alternate Actor titles for characters, such as " " for "Space".
     */
    aliases?: Aliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    replacements?: Replacements;

    /**
     * Separator for words to replace using replacements.
     */
    replacerKey?: string;

    /**
     * Known menu schemas, keyed by name.
     */
    schemas?: MenuSchemas;

    /**
     * Sounds that should be played for certain menu actions.
     */
    sounds?: SoundEvents;
}
