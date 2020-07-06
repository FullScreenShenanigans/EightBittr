import { EightBittr, IThing } from "eightbittr";

/**
 * General attributes for both Menus and MenuSchemas.
 */
export interface IMenuBase {
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
    childrenSchemas?: IMenuChildSchema[];

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
    size?: IMenuSchemaSize;

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
export interface IMenusContainer {
    [i: string]: IMenu;
}

/**
 * A general Text THing.
 */
export interface IText extends IThing {
    /**
     * How much vertical padding this Thing requires.
     */
    paddingY: number;
}

/**
 * Known menu schemas, keyed by name.
 */
export interface IMenuSchemas {
    [i: string]: IMenuSchema;
}

/**
 * A schema to specify creating a menu.
 */
export interface IMenuSchema extends IMenuBase {
    /**
     * How the menu should be positioned within its container.
     */
    position?: IMenuSchemaPosition;
}

/**
 * A schema to specify creating a list menu.
 */
export interface IListMenuSchema extends IMenuSchema {
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
export interface IMenuSchemaSize {
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
export type ISchemaPositionHorizontalModifier = "center" | "right" | "stretch";

/**
 * Modifies how a schema lays itself out vertically.
 */
export type ISchemaPositionVerticalModifier = "center" | "bottom" | "stretch";

/**
 * A description of how a meny should be positioned within its container.
 */
export interface IMenuSchemaPosition {
    /**
     * Modifies how the schema lays itself out horizontally.
     */
    horizontal?: ISchemaPositionHorizontalModifier;

    /**
     * Horizontal and vertical offsets to shift the menu by.
     */
    offset?: IMenuSchemaPositionOffset;

    /**
     * Modifies how the schema lays itself out vertically.
     */
    vertical?: ISchemaPositionVerticalModifier;
}

/**
 * Horizontal and vertical offsets to shift the menu by.
 */
export interface IMenuSchemaPositionOffset {
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
export type IMenuChildSchema = IMenuChildMenuSchema | IMenuWordSchema | IMenuThingSchema;

/**
 * A description of a menu to create as a menu child.
 */
export interface IMenuChildMenuSchema {
    /**
     * Menu attributes to pass to the menu.
     */
    attributes?: IMenuSchema;

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
export interface IMenuWordSchema {
    /**
     * How to position the word within the menu.
     */
    position?: IMenuSchemaPosition;

    /**
     * A description of the word area's size.
     */
    size?: IMenuSchemaSize;

    /**
     * What type of child this is.
     */
    type: "text";

    /**
     * Raw words to set as the text contents.
     */
    words: (string | string[] | IMenuWordCommand)[];
}

/**
 * A description of a Thing to create as a menu child.
 */
export interface IMenuThingSchema {
    /**
     * Arguments to proliferate onto the Thing.
     */
    args?: any;

    /**
     * How to position the Thing within the menu.
     */
    position?: IMenuSchemaPosition;

    /**
     * A description of the Thing's size.
     */
    size?: IMenuSchemaSize;

    /**
     * What Thing title to create.
     */
    thing: string;

    /**
     * What type of child this is.
     */
    type: "thing";
}

/**
 * Various raw forms of dialog that may be used. A single String is common
 * for short dialogs, and longer ones may use a String for each word or character,
 * as well as filtered Objects.
 */
export type IMenuDialogRaw =
    | string
    | (string | string[] | (string | string[])[] | IMenuWordCommandBase)[];

/**
 * A general word and/or command to use within a text dialog.
 */
export interface IMenuWordCommandBase {
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
export interface IMenuWordCommand extends IMenuWordCommandBase {
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
export interface IMenuWordPadLeftCommand extends IMenuWordCommandBase {
    /**
     * Whether the amount of padding should be reduced by the word length.
     */
    alignRight?: boolean;
}

/**
 * A word command to reset an attribute after an attribute change command.
 */
export interface IMenuWordReset extends IMenuWordCommandBase {
    /**
     * The name of the attribute to reset.
     */
    attribute: string;
}

/**
 * A word command to shift the position to add subsequent words.
 */
export interface IMenuWordPosition extends IMenuWordCommandBase {
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
 * A Menu Thing, with any number of children.
 */
export interface IMenu extends IThing, IMenuSchema {
    /**
     * Child Things visible within the Menu.
     */
    children: IThing[];

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
export interface IListMenuBase {
    /**
     * The grid of options, as columns containing rows.
     */
    grid: IGridCell[][];

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
    options: IGridCell[];

    /**
     * The currently selected [column, row] in the grid.
     */
    selectedIndex: [number, number];
}

/**
 * A menu containing some number of options as cells in a grid.
 */
export interface IListMenu extends IListMenuBase, IListMenuSchema, IMenu {
    /**
     * Arrow Thing indicating the current selection.
     */
    arrow: IThing;

    /**
     * Horizontal offset for the arrow Thing.
     */
    arrowXOffset?: number;

    /**
     * Vertical offset for the arrow Thing.
     */
    arrowYOffset?: number;

    /**
     * How tall this is.
     */
    height: number;

    /**
     * Descriptions of the options, with their grid cell and Things.
     */
    optionChildren: any[];

    /**
     * Class names for the menu's arrow when active or inactive, it it shouldn't be hidden when inactive.
     */
    preserveArrow?: IListMenuPreserveArrow;

    /**
     * A summary of the menu's progress through its list.
     */
    progress: IListMenuProgress;

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
export interface IGridCell {
    /**
     * A callback for selecting this cell with a user selection event.
     */
    callback?(...args: any[]): void;

    /**
     * The column containing this option.
     */
    column: IGridCell[];

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
    text: (string | IMenuWordCommand)[];

    /**
     * Optionally, an equivalent title that represents this option.
     */
    title?: string;

    /**
     * Floating texts that should be added with the option.
     */
    textsFloating?: any;

    /**
     * Things that visually represent this option.
     */
    things: IThing[];

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
export type IListMenuOptionCallback = (menuName: string) => void;

/**
 * Single text option in a list.
 */
export interface IListMenuOption {
    /**
     * Callback for when the option is triggered.
     */
    callback?: IListMenuOptionCallback;

    /**
     * Horizontal and vertical offsets to shift the option by.
     */
    position?: IMenuSchemaPositionOffset;

    /**
     * Text displayed as the option.
     */
    text: IMenuDialogRaw;
}

/**
 * Settings to create a new list menu.
 */
export interface IListMenuOptions {
    /**
     * A bottom option to place below all grid options.
     */
    bottom?: IListMenuOption;

    /**
     * Options within the menu, or a function to generate them.
     */
    options: IListMenuOption[] | (() => IListMenuOption[]);

    /**
     * A default starting selected index.
     */
    selectedIndex?: [number, number];
}

/**
 * Class names for the menu's arrow when active or inactive, it it shouldn't be hidden when inactive.
 */
export interface IListMenuPreserveArrow {
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
export interface IListMenuProgress {
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
export interface ISoundEvents {
    /**
     * The sound to play, if any, when interacting with a menu (usually off the A
     * or B buttons being registered).
     */
    onInteraction?: () => void;
}

/**
 * Alternate Thing titles for characters, such as " " to "space".
 */
export interface IAliases {
    [i: string]: string;
}

/**
 * Programmatic replacements for deliniated words.
 */
export interface IReplacements {
    [i: string]: string[] | IReplacerFunction;
}

/**
 * A Function to generate a word replacement based on the EightBitter's state.
 */
export type IReplacerFunction = (game: EightBittr) => string[];

/**
 * Settings to initialize a new IMenuGraphr.
 */
export interface IMenuGraphrSettings {
    /**
     * The parent EightBittr managing Things.
     */
    game: EightBittr;

    /**
     * Alternate Thing titles for characters, such as " " for "Space".
     */
    aliases?: IAliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    replacements?: IReplacements;

    /**
     * Separator for words to replace using replacements.
     */
    replacerKey?: string;

    /**
     * Known menu schemas, keyed by name.
     */
    schemas?: IMenuSchemas;

    /**
     * Sounds that should be played for certain menu actions.
     */
    sounds?: ISoundEvents;
}
