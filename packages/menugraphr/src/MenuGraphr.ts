import { EightBittr, Actor } from "eightbittr";

import {
    Aliases,
    GridCell,
    ListMenu,
    ListMenuOption,
    ListMenuOptions,
    ListMenuProgress,
    Menu,
    MenuBase,
    MenuChildSchema,
    MenuDialogRaw,
    MenuGraphrSettings,
    MenuSchema,
    MenuSchemaPosition,
    MenuSchemaPositionOffset,
    MenuSchemas,
    MenuSchemaSize,
    MenusContainer,
    MenuActorSchema,
    MenuWordCommand,
    MenuWordCommandBase,
    MenuWordPadLeftCommand,
    MenuWordPosition,
    MenuWordSchema,
    Replacements,
    ReplacerFunction,
    SoundEvents,
    Text,
} from "./types";

/**
 * Cardinal directions as Numbers.
 */
export enum Direction {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3,
}

/**
 * Text-based menu and dialog management system.
 */
export class MenuGraphr {
    /**
     * The parent EightBittr managing Actors.
     */
    private readonly game: EightBittr;

    /**
     * All available menus, keyed by name.
     */
    private readonly menus: MenusContainer;

    /**
     * Known menu schemas, keyed by name.
     */
    private readonly schemas: MenuSchemas;

    /**
     * Sounds that should be played for certain menu actions.
     */
    private readonly sounds: SoundEvents;

    /**
     * Alternate Actor titles for characters, such as " " for "space".
     */
    private readonly aliases: Aliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    private readonly replacements: Replacements;

    /**
     * Separator for words to replace using replacements.
     */
    private readonly replacerKey: string;

    /**
     * The currently "active" (user-selected) menu.
     */
    private activeMenu?: Menu;

    /**
     * Initializes a new instance of the MenuGraphr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: MenuGraphrSettings) {
        this.game = settings.game;

        this.schemas = settings.schemas || {};
        this.aliases = settings.aliases || {};
        this.replacements = settings.replacements || {};
        this.replacerKey = settings.replacerKey || "%%%%%%%";
        this.sounds = settings.sounds || {};

        this.menus = {};
    }

    /**
     * @returns All available menus, keyed by name.
     */
    public getMenus(): MenusContainer {
        return this.menus;
    }

    /**
     * @param name   A name of a menu.
     * @returns The menu under the given name.
     */
    public getMenu(name: string): Menu {
        return this.menus[name];
    }

    /**
     * Returns a menu, throwing an error if it doesn't exist.
     *
     * @param name   A name of a menu.
     * @returns The menu under the given name.
     */
    public getExistingMenu(name: string): Menu {
        if (!this.menus[name]) {
            throw new Error(`The '${name}' menu does not exist.`);
        }

        return this.menus[name];
    }

    /**
     * @returns The currently active menu.
     */
    public getActiveMenu(): Menu | undefined {
        return this.activeMenu;
    }

    /**
     * @returns The name of the currently active menu.
     */
    public getActiveMenuName(): string {
        if (!this.activeMenu) {
            throw new Error("There is no active menu.");
        }

        return this.activeMenu.name;
    }

    /**
     * @returns The alternate Actor titles for characters.
     */
    public getAliases(): Aliases {
        return this.aliases;
    }

    /**
     * @returns The programmatic replacements for deliniated words.
     */
    public getReplacements(): Replacements {
        return this.replacements;
    }

    /**
     * Creates a menu with the given name and attributes, and stores it under the name.
     * Default information is used from the schema of that name, such as position and
     * children, but may be override by attributes.
     *
     * @param name   The name of the menu.
     * @param attributes   Custom attributes to apply to the menu.
     * @returns The newly created menu.
     */
    public createMenu(name: string, attributes?: MenuSchema): Menu {
        const schemaRaw: MenuSchema = this.game.utilities.proliferate({}, this.schemas[name]);
        const schema: MenuSchema = this.game.utilities.proliferate(schemaRaw, attributes);
        const menu: Menu = this.game.objectMaker.make<Menu>("Menu", schema);

        // If the container menu doesn't exist, a pseudo-menu the size of the screen is used
        const container: Menu = schema.container
            ? this.getExistingMenu(schema.container)
            : ({
                  bottom: this.game.mapScreener.height,
                  children: [],
                  height: this.game.mapScreener.height,
                  left: 0,
                  right: this.game.mapScreener.width,
                  top: 0,
                  width: this.game.mapScreener.width,
              } as any);

        this.deleteMenu(name);

        this.menus[name] = menu;
        menu.name = name;
        this.placeMenuActor(container, menu, schema.size, schema.position);

        menu.children = [];
        menu.textAreaWidth = menu.width - (menu.textXOffset || 0) * 2;

        if (menu.childrenSchemas) {
            menu.childrenSchemas.forEach(this.createMenuChild.bind(this, name));
        }

        if (container.children) {
            container.children.push(menu);
        }

        this.game.utilities.proliferate(menu, attributes);

        return menu;
    }

    /**
     * Adds a child object to an existing menu.
     *
     * @param name   The name of the existing menu.
     * @param schema   Settings for the child, including name and child type.
     * @returns The newly created Actor or Actors.
     * @remarks Creating a menu is done using this.createMenu, so the created menu might
     *          not mark itself as a child of the parent.
     */
    public createMenuChild(name: string, schema: MenuChildSchema): Actor | Actor[] {
        switch (schema.type) {
            case "menu":
                return this.createMenu(schema.name, schema.attributes);

            case "text":
                return this.createMenuWord(name, schema);

            case "actor":
                return this.createMenuActor(name, schema);

            default:
                throw new Error(`Unknown schema type: '${(schema as MenuChildSchema).type}'.`);
        }
    }

    /**
     * Creates a series of words as a child of a menu.
     *
     * @param name   The name of the menu.
     * @param schema   Settings for the words.
     * @returns The words' character Actors.
     */
    public createMenuWord(name: string, schema: MenuWordSchema): Actor[] {
        const menu: Menu = this.getExistingMenu(name);
        const container: Menu = this.game.objectMaker.make<Menu>("Menu");
        const words: (string[] | MenuWordCommand)[] = this.filterMenuWords(schema.words);

        this.placeMenuActor(menu, container, schema.size, schema.position, true);
        menu.textX = container.left;

        return this.addMenuWords(name, words, 0, container.left, container.top);
    }

    /**
     * Creates a Actor as a child of a menu.
     *
     * @param name   The name of the menu.
     * @param schema   Settings for the Actor.
     * @returns The newly created Actor.
     */
    public createMenuActor(name: string, schema: MenuActorSchema): Actor {
        const menu: Menu = this.getExistingMenu(name);
        const actor: Actor = this.game.objectMaker.make<Actor>(schema.actor, schema.args);

        this.placeMenuActor(menu, actor, schema.size, schema.position);

        this.game.groupHolder.switchGroup(actor, actor.groupType, "Text");

        menu.children.push(actor);

        return actor;
    }

    /**
     * Hides a menu of the given name and deletes its children, if it exists.
     *
     * @param name   The name of the menu to hide.
     */
    public hideMenu(name: string): void {
        const menu: Menu = this.menus[name];

        if (menu) {
            menu.hidden = true;
            this.deleteMenuChildren(name);
        }
    }

    /**
     * Deletes a menu of the given name, if it exists.
     *
     * @param name   The name of the menu to delete.
     */
    public deleteMenu(name: string): void {
        const menu: ListMenu = this.menus[name] as ListMenu;
        if (!menu) {
            return;
        }

        if (menu.clearedIndicesOnDeletion) {
            this.clearMenuIndices(name);
        }

        this.deleteMenuChild(menu);
    }

    /**
     * Deletes the active menu, if it exists.
     */
    public deleteActiveMenu(): void {
        if (this.activeMenu) {
            this.deleteMenu(this.activeMenu.name);
        }
    }

    /**
     * Deletes all menus.
     */
    public deleteAllMenus(): void {
        for (const i in this.menus) {
            if ({}.hasOwnProperty.call(this.menus, i)) {
                this.deleteMenu(i);
            }
        }
    }

    /**
     * Adds dialog-style text to a menu.
     *
     * @param menuName   Name of the menu.
     * @param dialog   Raw dialog to add to the menu.
     * @param onCompletion   An optional callback for when the text is done.
     */
    public addMenuDialog(
        menuName: string,
        dialog: MenuDialogRaw,
        onCompletion?: () => any
    ): void {
        const dialogParsed: (string[] | MenuWordCommand)[][] = this.parseRawDialog(dialog);
        let currentLine = 1;

        const callback: () => void = (): void => {
            // If all dialog has been exhausted, delete the menu and finish
            if (currentLine >= dialogParsed.length) {
                if (this.menus[menuName].deleteOnFinish) {
                    this.deleteMenu(menuName);
                }
                if (onCompletion) {
                    onCompletion();
                }
                return;
            }

            currentLine += 1;

            // Delete any previous texts. This is only done if continuing
            // So that when the dialog is finished, the last text remains
            this.deleteMenuChildren(menuName);

            // This continues the dialog with the next iteration (word)
            this.addMenuText(menuName, dialogParsed[currentLine - 1], callback);
        };

        // This first call to addMenuText shouldn't be the callback.
        // If called from a childrenSchema of type "text", it shouldn't delete any other menu children from childrenSchemas.
        this.addMenuText(menuName, dialogParsed[0], callback);
    }

    /**
     * Continues a menu from its current display words to the next line.
     *
     * @param name    The name of the menu.
     */
    public continueMenu(name: string): void {
        const menu = this.getExistingMenu(name) as ListMenu;
        const children = menu.children;
        const progress: ListMenuProgress | undefined = menu.progress;

        if (!progress || progress.working) {
            return;
        }

        progress.working = true;

        if (progress.complete) {
            if (!progress.onCompletion || progress.onCompletion(this.game, menu)) {
                this.deleteMenu(name);
            }
            return;
        }

        if (menu.finishLinesAutomatically) {
            for (const character of children) {
                this.scrollCharacterUp(character, menu, 2);
            }

            this.addMenuWords(
                name,
                progress.words,
                progress.i,
                progress.x,
                progress.y,
                progress.onCompletion
            );
        } else {
            for (const character of children) {
                this.game.timeHandler.addEventInterval(
                    () => this.scrollCharacterUp(character, menu, 2),
                    1,
                    (character as Text).paddingY / 2
                );
            }

            this.game.timeHandler.addEvent((): void => {
                this.addMenuWords(
                    name,
                    progress.words,
                    progress.i,
                    progress.x,
                    progress.y,
                    progress.onCompletion
                );
            }, ((children[children.length - 1] as Text).paddingY / 2) | 0);
        }

        this.sounds.onInteraction?.();
    }

    /**
     * Adds a list of text options to a menu.
     *
     * @param name   The name of the menu.
     * @param settings   Settings for the list, particularly its options.
     */
    public addMenuList(name: string, settings: ListMenuOptions): void {
        const menu: ListMenu = this.getExistingMenu(name) as ListMenu;
        const options: ListMenuOption[] =
            typeof settings.options === "function" ? settings.options() : settings.options;
        let left: number = menu.left + (menu.textXOffset || 0);
        const top: number = menu.top + (menu.textYOffset || 0);
        const textProperties: any = this.game.objectMaker.getPrototypeOf("Text");
        const textWidth: number = menu.textWidth || textProperties.width;
        const textHeight: number = menu.textHeight || textProperties.height;
        const textPaddingY: number = menu.textPaddingY || textProperties.paddingY || textHeight;
        const selectedIndex: [number, number] = settings.selectedIndex || [0, 0];
        const optionChildren: any[] = [];
        let index = 0;
        let y: number = top;
        let option: any;
        let optionChild: any;
        let schema: any;
        let title: string;
        let character: Actor;
        let column: GridCell[];
        let x: number;
        let i: number;
        let j: number;
        let k: number;

        menu.options = options as any[];
        menu.optionChildren = optionChildren;

        menu.callback = this.triggerMenuListOption.bind(this);
        menu.onActive = this.activateMenuList.bind(this);
        menu.onInactive = this.deactivateMenuList.bind(this);

        menu.grid = [];
        menu.grid[0] = column = [];
        menu.gridRows = 0;

        if (!options.length) {
            return;
        }

        for (i = 0; i < options.length; i += 1) {
            x = left;
            option = options[i];
            optionChild = {
                option,
                actors: [],
            };

            optionChildren.push(optionChild);

            option.x = x;
            option.y = y;

            column.push(option);
            option.column = column;
            option.index = index;
            option.columnNumber = menu.grid.length - 1;
            option.rowNumber = column.length - 1;
            menu.gridRows = Math.max(menu.gridRows, column.length);
            index += 1;

            if (option.actors) {
                for (j = 0; j < option.actors.length; j += 1) {
                    schema = option.actors[j];
                    character = this.createMenuActor(name, schema);
                    menu.children.push(character);
                    optionChild.actors.push(character);

                    if (!schema.position) {
                        this.game.physics.shiftVert(character, y - menu.top);
                    }
                }
            }

            if (option.textsFloating) {
                for (j = 0; j < option.textsFloating.length; j += 1) {
                    schema = option.textsFloating[j];

                    optionChild.actors = optionChild.actors.concat(
                        this.addMenuWords(name, [schema.text], 0, x + schema.x, y + schema.y)
                    );
                }
            }

            option.schema = schema = this.filterText(option.text);

            if (schema !== "\n") {
                for (j = 0; j < schema.length; j += 1) {
                    for (k = 0; k < schema[j].length; k += 1) {
                        if (schema[j][k].command) {
                            if (schema[j][k].x) {
                                x += schema[j][k].x;
                            }
                            if (schema[j][k].y) {
                                y += schema[j][k].y;
                            }
                        } else {
                            option.title = title = `Char${this.getCharacterEquivalent(
                                schema[j][k]
                            )}`;
                            character = this.game.objectMaker.make<Text>(title);
                            menu.children.push(character);
                            optionChild.actors.push(character);

                            this.game.actors.add(character, x, y);

                            x += character.width;
                        }
                    }
                }
            }

            y += textPaddingY;

            if (!menu.singleColumnList && y > menu.bottom - textHeight + 1) {
                y = top;
                left +=
                    menu.textColumnWidth instanceof Array
                        ? menu.textColumnWidth[option.columnNumber]
                        : menu.textColumnWidth || textWidth;
                column = [];
                menu.grid.push(column);
            }
        }

        while (menu.grid[menu.grid.length - 1].length === 0) {
            menu.grid.pop();
        }
        menu.gridColumns = menu.grid.length;

        if (settings.bottom) {
            option = settings.bottom;
            option.schema = schema = this.filterText(option.text);

            optionChild = {
                option,
                actors: [],
            };
            optionChildren.push(optionChild);

            x = menu.left + (menu.textXOffset || 0) + option.position.left;
            y = menu.top + (menu.textYOffset || 0) + option.position.top;

            option.x = x;
            option.y = y;

            // Copy & pasted from the above options loop
            // Todo: make this into its own helper function?
            for (j = 0; j < schema.length; j += 1) {
                for (k = 0; k < schema[j].length; k += 1) {
                    if (schema[j][k].command) {
                        if (schema[j][k].x) {
                            x += schema[j][k].x;
                        }
                        if (schema[j][k].y) {
                            y += schema[j][k].y;
                        }
                    } else if (schema[j][k] !== " ") {
                        option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                        character = this.game.objectMaker.make<Text>(title);
                        menu.children.push(character);
                        optionChild.actors.push(character);

                        this.game.actors.add(character, x, y);

                        x += character.width;
                    } else {
                        x += textWidth;
                    }
                }
            }

            menu.gridRows += 1;
            for (j = 0; j < menu.grid.length; j += 1) {
                menu.grid[j].push(option);
            }
        }

        if (menu.scrollingItemsComputed) {
            menu.scrollingItems = this.computeMenuScrollingItems(menu);
        }

        if (menu.scrollingItems) {
            menu.scrollingVisualOffset = 0;

            for (i = menu.scrollingItems; i < menu.gridRows; i += 1) {
                optionChild = optionChildren[i];
                for (j = 0; j < optionChild.actors.length; j += 1) {
                    optionChild.actors[j].hidden = true;
                }
            }
        }

        if (menu.saveIndex) {
            if (this.game.itemsHolder.hasKey(name)) {
                menu.selectedIndex = this.game.itemsHolder.getItem(name);
            } else {
                menu.selectedIndex = selectedIndex;
                this.game.itemsHolder.addItem(name, {
                    valueDefault: selectedIndex,
                });
            }
        } else {
            menu.selectedIndex = selectedIndex;
        }

        menu.arrow = character = this.game.objectMaker.make<Actor>("CharArrowRight");
        menu.children.push(character);

        if (menu.preserveArrow) {
            this.game.graphics.classes.addClass(
                menu.arrow,
                this.activeMenu === menu
                    ? menu.preserveArrow.classActive
                    : menu.preserveArrow.classInactive
            );
        } else {
            character.hidden = this.activeMenu !== menu;
        }

        option = menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];

        this.game.actors.add(character);
        this.game.physics.setRight(character, option.x - (menu.arrowXOffset || 0));
        this.game.physics.setTop(character, option.y + (menu.arrowYOffset || 0));
    }

    /**
     * Retrives the currently selected grid cell of a menu.
     *
     * @param name   The name of the menu.
     * @returns The currently selected grid cell of the menu.
     */
    public getMenuSelectedOption(name: string): GridCell {
        const menu: ListMenu = this.getExistingMenu(name) as ListMenu;

        if (!menu.grid || !menu.selectedIndex) {
            throw new Error("The " + name + " menu does not behave like a list menu.");
        }

        return menu.grid[menu.selectedIndex[0]][menu.selectedIndex[1]];
    }

    /**
     * Shifts the selected index of a list menu, adjusting for scrolling if necessary.
     *
     * @param name   The name of the menu.
     * @param dx   How far along the menu's grid to shift horizontally.
     * @param dy   How far along the menu's grid to shift vertically.
     */
    public shiftSelectedIndex(name: string, dx: number, dy: number): void {
        const menu = this.getExistingMenu(name) as ListMenu;
        const textProperties = this.game.objectMaker.getPrototypeOf<Text>("Text");
        const textPaddingY = menu.textPaddingY || textProperties.paddingY || 0;
        let x: number;
        let y: number;

        if (menu.scrollingItems) {
            x = menu.selectedIndex[0] + dx;
            y = menu.selectedIndex[1] + dy;

            x = Math.max(Math.min(menu.gridColumns - 1, x), 0);
            y = Math.max(Math.min(menu.gridRows - 1, y), 0);
        } else {
            x = (menu.selectedIndex[0] + dx) % menu.gridColumns;
            y = (menu.selectedIndex[1] + dy) % menu.gridRows;

            while (x < 0) {
                x += menu.gridColumns;
            }

            while (y < 0) {
                y += menu.gridRows;
            }
        }

        if (x === menu.selectedIndex[0] && y === menu.selectedIndex[1]) {
            return;
        }

        menu.selectedIndex[0] = x;
        menu.selectedIndex[1] = y;
        const option = this.getMenuSelectedOption(name);

        if (menu.scrollingItems) {
            this.scrollListActors(name, dy, textPaddingY);
        }

        this.game.physics.setRight(menu.arrow, option.x - (menu.arrowXOffset || 0));
        this.game.physics.setTop(menu.arrow, option.y + (menu.arrowYOffset || 0));

        if (menu.saveIndex) {
            this.game.itemsHolder.setItem(name, menu.selectedIndex);
        }

        if (menu.selectIndex) {
            this.registerA();
        }
    }

    /**
     * Sets the current selected index of a menu.
     *
     * @param name   The name of the menu.
     * @param x   The new horizontal value for the index.
     * @param y   The new vertical value for the index.
     */
    public setSelectedIndex(name: string, x: number, y: number): void {
        const menu = this.getExistingMenu(name) as ListMenu;
        const selectedIndex = menu.selectedIndex;

        this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
    }

    /**
     * Sets the currently active menu.
     *
     * @param name   The name of the menu to set as active.
     */
    public setActiveMenu(name: string | undefined): void {
        if (!name) {
            throw new Error("Tried setting an undefined active menu.");
        }

        if (this.activeMenu && this.activeMenu.onInactive) {
            this.activeMenu.onInactive(this.activeMenu.name);
        }

        this.activeMenu = this.menus[name];

        if (this.activeMenu && this.activeMenu.onActive) {
            this.activeMenu.onActive(name);
        }
    }

    /**
     * Reacts to a user event directing in the given direction.
     *
     * @param direction   The direction of the interaction.
     */
    public registerDirection(direction: number): void {
        switch (direction) {
            case Direction.Top:
                this.registerUp();
                break;
            case Direction.Right:
                this.registerRight();
                break;
            case Direction.Bottom:
                this.registerDown();
                break;
            case Direction.Left:
                this.registerLeft();
                break;
            default:
                throw new Error("Unknown direction: " + direction);
        }
    }

    /**
     * Reacts to a user event directing up.
     */
    public registerUp(): void {
        const menu: ListMenu = this.activeMenu as ListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, 0, -1);
        }

        if (menu.onUp) {
            menu.onUp(this.game);
        }
    }

    /**
     * Reacts to a user event directing to the right.
     */
    public registerRight(): void {
        const menu: ListMenu = this.activeMenu as ListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, 1, 0);
        }

        if (menu.onRight) {
            menu.onRight(this.game);
        }
    }

    /**
     * Reacts to a user event directing down.
     */
    public registerDown(): void {
        const menu = this.activeMenu;
        if (!menu) {
            return;
        }

        if ((menu as ListMenu).selectedIndex) {
            this.shiftSelectedIndex(menu.name, 0, 1);
        }

        if (menu.onDown) {
            menu.onDown(menu.name);
        }
    }

    /**
     * Reacts to a user event directing to the left.
     */
    public registerLeft(): void {
        const menu: ListMenu = this.activeMenu as ListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, -1, 0);
        }

        if (menu.onLeft) {
            menu.onLeft(menu.name);
        }
    }

    /**
     * Reacts to a user event from pressing a selection key.
     */
    public registerA(): void {
        const menu: Menu | undefined = this.activeMenu;
        if (!menu || menu.ignoreA) {
            return;
        }

        if (menu.callback) {
            menu.callback(menu.name);
        }

        if (
            this.sounds.onInteraction &&
            (!(menu as ListMenu).progress || !(menu as ListMenu).progress.working)
        ) {
            this.sounds.onInteraction();
        }
    }

    /**
     * Reacts to a user event from pressing a deselection key.
     */
    public registerB(): void {
        const menu: Menu | undefined = this.activeMenu;
        if (!menu) {
            return;
        }

        if ((menu as ListMenu).progress && !menu.ignoreProgressB) {
            return this.registerA();
        }

        if (menu.ignoreB) {
            return;
        }

        if (menu.onBPress) {
            menu.onBPress(menu.name);
            return;
        }

        if (menu.keepOnBack) {
            this.setActiveMenu(menu.backMenu);
        } else {
            this.deleteMenu(menu.name);
        }

        if (
            this.sounds.onInteraction &&
            (!(menu as ListMenu).progress || !(menu as ListMenu).progress.working)
        ) {
            this.sounds.onInteraction();
        }
    }

    /**
     * Adds a series of words to a menu.
     *
     * @param name   The name of the menu.
     * @param words   Words to add to the menu, as String[]s and/or commands.
     * @param onCompletion   An optional event for when the words are added.
     */
    private addMenuText(
        name: string,
        words: (string[] | MenuWordCommand)[],
        onCompletion?: (...args: any[]) => void
    ): void {
        const menu: Menu = this.getExistingMenu(name);
        let x: number = this.game.physics.getMidX(menu);
        const y: number = menu.top + (menu.textYOffset || 0);

        switch (menu.textStartingX) {
            case "right":
                x += (menu.textAreaWidth || 0) / 2;
                break;

            case "center":
                break;

            default:
                x -= (menu.textAreaWidth || 0) / 2;
                break;
        }

        menu.callback = this.continueMenu.bind(this);
        menu.textX = x;

        if (words.length) {
            this.addMenuWords(name, words, 0, x, y, onCompletion);
        } else if (onCompletion) {
            onCompletion();
        }
    }

    /**
     * Adds a word within a series of words to a menu, then adds the next word,
     * and so on. This is the real force behind addMenuDialog and addMenuText.
     *
     * @param name   The name of the menu.
     * @param words   Words to add to the menu, as String[]s and/or commands.
     * @param i   The index of the current word to add.
     * @param x   The x-location to place the word at.
     * @param y   The y-location to place the word at.
     * @param onCompletion   An optional event for when the words are added.
     * @returns The generated Actors from the word's characters.
     */
    private addMenuWords(
        name: string,
        words: (string[] | MenuWordCommand)[],
        i: number,
        x: number,
        y: number,
        onCompletion?: () => void
    ): Actor[] {
        const menu: ListMenu = this.getExistingMenu(name) as ListMenu;
        const textProperties: any = this.game.objectMaker.getPrototypeOf("Text");
        const actors: Actor[] = [];
        const textPaddingRight: number = menu.textPaddingRight || 0;
        const textPaddingX: number = menu.textPaddingX || textProperties.paddingX || 0;
        const textPaddingY: number = menu.textPaddingY || textProperties.paddingY || 0;
        const textSpeed: number = typeof menu.textSpeed === undefined ? 1 : menu.textSpeed || 0;
        const textWidth: number = menu.textWidth || textProperties.width;
        const progress: ListMenuProgress = (menu.progress = {
            i,
            onCompletion,
            words,
            x,
            y,
        });
        let character: Text;
        let j: number;
        let command: MenuWordCommandBase;
        let word: string[];

        // Command objects must be parsed here in case they modify the x/y position
        if ((words[i] as MenuWordCommand).command) {
            command = words[i] as MenuWordCommand;
            word = this.parseWordCommand(command as MenuWordCommand, menu);

            if ((command as MenuWordCommand).command === "position") {
                x += (command as MenuWordPosition).x || 0;
                y += (command as MenuWordPosition).y || 0;
            }
        } else {
            word = words[i] as string[];
        }

        // For each character in the word, schedule it appearing in the menu
        for (j = 0; j < word.length; j += 1) {
            // For non-whitespace characters, add them and move to the right
            if (/\S/.test(word[j])) {
                character = this.addMenuCharacter(name, word[j], x, y, j * textSpeed);
                x += character.width + textPaddingX;
                continue;
            }

            // Endlines skip a line; general whitespace moves to the right
            // (" " spaces at the start do not move to the right)
            if (word[j] === "\n") {
                x = menu.textX!;
                y += textPaddingY;
            } else if (word[j] !== " " || x !== menu.textX) {
                x += textWidth;
            }
        }

        const finalizeLine = () => {
            progress.working = false;

            const { callback } = menu;

            if (menu.finishLinesAutomatically && callback !== undefined) {
                if (!menu.finishLinesAutomaticSpeed) {
                    callback(menu.name);
                } else {
                    this.game.timeHandler.addEvent((): void => {
                        callback(menu.name);
                    }, menu.finishLinesAutomaticSpeed);
                }
            }
        };

        // If this is the last word in the the line (words), mark progress as complete
        if (i === words.length - 1) {
            progress.complete = true;

            if (menu.finishAutomatically && onCompletion) {
                if (!menu.finishAutomaticSpeed) {
                    onCompletion();
                } else {
                    this.game.timeHandler.addEvent(
                        onCompletion,
                        (word.length + menu.finishAutomaticSpeed) * textSpeed
                    );
                }
            }

            return actors;
        }

        // If the next word would pass the edge of the menu, move down a line
        if (
            x + this.computeFutureWordLength(words[i + 1], textWidth, textPaddingX) >=
            menu.right - (menu.textXOffset || 0) - textPaddingRight
        ) {
            x = menu.textX!;
            y += textPaddingY;
        }

        // Mark the menu's progress as working and incomplete
        progress.working = true;
        progress.complete = false;
        progress.words = words;
        progress.i = i + 1;
        progress.x = x;
        progress.y = y - textPaddingY;

        // Once the bottom of the menu has been reached, pause the progress
        if (y >= menu.bottom - (menu.textYOffset || 0) - 1) {
            if (textSpeed === 0) {
                finalizeLine();
            } else {
                this.game.timeHandler.addEvent(finalizeLine, (j + 1) * textSpeed);
            }

            return actors;
        }

        if (textSpeed) {
            this.game.timeHandler.addEvent((): void => {
                this.addMenuWords(name, words, i + 1, x, y, onCompletion);
            }, (j + 1) * textSpeed);
        } else {
            this.addMenuWords(name, words, i + 1, x, y, onCompletion);
        }

        return actors;
    }

    /**
     * Places and positions a Actor within a menu basd on its size and position schemas.
     *
     * @param actor   The Actor to place and position.
     * @param size   An optional description of the Actor's size.
     * @param position   An optional description of the Actor's position.
     * @param skipAdd   Whether to skip calling this.game.actors.add on the Actor.
     */
    private placeMenuActor(
        menu: Menu,
        actor: Actor,
        size: MenuSchemaSize = {},
        position: MenuSchemaPosition = {},
        skipAdd?: boolean
    ): void {
        const offset: MenuSchemaPositionOffset = position.offset || {};

        if (size.width) {
            this.game.physics.setWidth(actor, size.width);
        } else if (position.horizontal === "stretch") {
            this.game.physics.setLeft(actor, 0);
            this.game.physics.setWidth(
                actor,
                menu.width - (offset.left || 0) - (offset.right || 0)
            );
        }

        if (size.height) {
            this.game.physics.setHeight(actor, size.height);
        } else if (position.vertical === "stretch") {
            this.game.physics.setTop(actor, 0);
            this.game.physics.setHeight(
                actor,
                menu.height - (offset.top || 0) - (offset.bottom || 0)
            );
        }

        switch (position.horizontal) {
            case "center":
                this.game.physics.setMidXObj(actor, menu);
                break;
            case "right":
                this.game.physics.setRight(actor, menu.right);
                break;
            default:
                this.game.physics.setLeft(actor, menu.left);
                break;
        }

        switch (position.vertical) {
            case "center":
                this.game.physics.setMidYObj(actor, menu);
                break;
            case "bottom":
                this.game.physics.setBottom(actor, menu.bottom);
                break;
            default:
                this.game.physics.setTop(actor, menu.top);
                break;
        }

        if (offset.top) {
            this.game.physics.shiftVert(actor, offset.top);
        }

        if (offset.left) {
            this.game.physics.shiftHoriz(actor, offset.left);
        }

        if (!skipAdd) {
            this.game.actors.add(actor, actor.left, actor.top);
        }
    }

    /**
     * Adds a single character as an Actor to a menu, potentially with a time delay.
     *
     * @param name   The name of the menu.
     * @param character   The character to add.
     * @param x   The x-position of the character.
     * @param y   The y-position of the character.
     * @param delay   Optionally, how long to delay adding using TimeHandlr.
     * @returns The character's new Actor representation.
     */
    private addMenuCharacter(
        name: string,
        character: string,
        x: number,
        y: number,
        delay?: number
    ): Text {
        const menu: Menu = this.getExistingMenu(name);
        const textProperties: any = this.game.objectMaker.getPrototypeOf("Text");
        const textPaddingY: number = menu.textPaddingY || textProperties.paddingY;
        const title: string = "Char" + this.getCharacterEquivalent(character);
        const actor: Text = this.game.objectMaker.make<Text & MenuBase>(title, {
            textPaddingY,
        });

        menu.children.push(actor);

        if (delay) {
            this.game.timeHandler.addEvent((): void => {
                this.game.actors.add(actor, x, y);
            }, delay);
        } else {
            this.game.actors.add(actor, x, y);
        }

        return actor;
    }

    /**
     * Scrolls a menu's character up once. If it's above the menu's area, it's deleted.
     *
     * @param character   The Actor to scroll up.
     * @param menu
     * @param divisor   How rapidly to move the character up.
     * @returns Whether the character was deleted.
     */
    private scrollCharacterUp(character: Actor, menu: Menu, speed: number): boolean {
        this.game.physics.shiftVert(character, -speed);

        if (character.top < menu.top + ((menu.textYOffset || 0) - speed)) {
            this.game.death.kill(character);
            return true;
        }

        return false;
    }

    /**
     * Clears saved indices that should be forgotten when the menu is deleted.
     *
     * @param name   The name of the menu that is being deleted.
     */
    private clearMenuIndices(name: string): void {
        const menu: ListMenu = this.menus[name] as ListMenu;
        if (!menu.clearedIndicesOnDeletion) {
            return;
        }

        for (const menuName of menu.clearedIndicesOnDeletion) {
            this.game.itemsHolder.setItem(menuName, [0, 0]);
        }
    }

    /**
     * Deletes all children of a menu.
     *
     * @param name   The name of the menu.
     */
    private deleteMenuChildren(name: string): void {
        const menu: Menu = this.menus[name];

        if (menu && menu.children) {
            menu.children.forEach((child: Menu) => this.deleteMenuChild(child));
        }
    }

    /**
     * Deletes the child of a menu and any of its children.
     *
     * @param child   A menu child to delete.
     */
    private deleteMenuChild(child: Menu): void {
        if (this.activeMenu === child) {
            if (child.backMenu) {
                this.setActiveMenu(child.backMenu);
            } else {
                this.activeMenu = undefined;
            }
        }

        if (child.killOnB) {
            child.killOnB.forEach(this.deleteMenu.bind(this));
        }

        if (child.name) {
            delete this.menus[child.name];
        }

        this.game.death.kill(child);
        this.deleteMenuChildren(child.name);

        if (child.onMenuDelete) {
            child.onMenuDelete.call(this.game, this.game);
        }

        if (child.children) {
            child.children.forEach(this.deleteMenuChild.bind(this));
        }
    }

    /**
     * Un-hides a list menu's arrow Actor.
     *
     * @param name   The name of the menu.
     */
    private activateMenuList(name: string): void {
        const menu = this.menus[name] as ListMenu;
        if (!menu || !menu.arrow) {
            return;
        }

        if (menu.preserveArrow) {
            this.game.graphics.classes.switchClass(
                menu.arrow,
                menu.preserveArrow.classInactive,
                menu.preserveArrow.classActive
            );
        } else {
            menu.arrow.hidden = false;
        }
    }

    /**
     * Hides a list menu's arrow Actor.
     *
     * @param name   The name of the menu.
     */
    private deactivateMenuList(name: string): void {
        const menu = this.menus[name] as ListMenu;
        if (!menu || !menu.arrow) {
            return;
        }

        if (menu.preserveArrow) {
            this.game.graphics.classes.switchClass(
                menu.arrow,
                menu.preserveArrow.classActive,
                menu.preserveArrow.classInactive
            );
        } else {
            menu.arrow.hidden = true;
        }
    }

    /**
     * Runs the callback for a menu's selected list option.
     *
     * @param menuName   Name of the containing menu.
     */
    private triggerMenuListOption(menuName: string): void {
        const selected: GridCell = this.getMenuSelectedOption(menuName);

        if (selected.callback) {
            selected.callback.call(this, menuName);
        }
    }

    /**
     * Determines how many scrolling items are able to fit within a list menu, as
     * the index of the first bottom not within the menu.
     *
     * @param menu   The list menu.
     * @returns The number of scrolling items, or Infinity if they all fit.
     */
    private computeMenuScrollingItems(menu: ListMenu): number {
        const bottom: number = menu.bottom - (menu.textPaddingY || 0) - (menu.textYOffset || 0);

        for (let i = 0; i < menu.gridRows; i += 1) {
            if (menu.grid[0][i].y >= bottom) {
                return i;
            }
        }

        return Infinity;
    }

    /**
     * Scrolls a list menu's Actors vertically.
     *
     * @param name   The name of the menu.
     * @param dy   How far along the list menu's grid to scroll.
     * @param textPaddingY   How much text is padded, to compute scrolling with dy.
     */
    private scrollListActors(name: string, dy: number, textPaddingY: number): void {
        const menu: ListMenu = this.getExistingMenu(name) as ListMenu;
        const scrollingOld: number = menu.selectedIndex[1] - dy;
        const offset: number = -dy * textPaddingY;
        let option: GridCell;
        let optionChild: any;
        let i: number;
        let j: number;

        if (dy > 0) {
            if (
                scrollingOld - (menu.scrollingVisualOffset || 0) <
                (menu.scrollingItems || 1) - 1
            ) {
                return;
            }
        } else if (scrollingOld - (menu.scrollingVisualOffset || 0) > 0) {
            return;
        }

        menu.scrollingVisualOffset = (menu.scrollingVisualOffset || 0) + dy;

        for (i = 0; i < menu.optionChildren.length; i += 1) {
            option = menu.options[i];
            optionChild = menu.optionChildren[i];

            option.y += offset;

            for (j = 0; j < optionChild.actors.length; j += 1) {
                this.game.physics.shiftVert(optionChild.actors[j], offset);
                optionChild.actors[j].hidden = !!(
                    i < menu.scrollingVisualOffset ||
                    i >= (menu.scrollingItems || 1) + menu.scrollingVisualOffset
                );
            }
        }
    }

    /**
     * @param character   A String to retrieve an equivalent title of.
     * @returns The character's title from this.aliases if it exists, or the
     *          character itself otherwise.
     */
    private getCharacterEquivalent(character: string): string {
        if ({}.hasOwnProperty.call(this.aliases, character)) {
            return this.aliases[character];
        }

        return character;
    }

    /**
     * @param dialogRaw   Raw dialog of any type.
     * @returns The dialog parsed into lines of words.
     */
    private parseRawDialog(dialogRaw: MenuDialogRaw): (string[] | MenuWordCommand)[][] {
        // A raw String becomes a single line of dialog
        if (dialogRaw.constructor === String) {
            return [this.parseRawDialogString(dialogRaw)];
        }

        const output: (string[] | MenuWordCommand)[][] = [];

        for (const component of dialogRaw as string[] | string[][]) {
            if (component.constructor === String) {
                output.push(this.parseRawDialogString(component));
            } else {
                output.push(this.parseRawDialogStrings(component as string[]));
            }
        }

        return output;
    }

    /**
     * @param dialogRaw   A raw String or set of Strings.
     * @returns The raw dialog as lines of words.
     */
    private parseRawDialogString(dialogRaw: string | string[]): string[][] {
        const characters: string[] = this.filterWord(dialogRaw);
        const words: string[][] = [];
        let word: string[] = [];
        let currentlyWhitespace = false;

        // For each character to be added...
        for (const character of characters) {
            // If it matches what's currently being added (whitespace or not), keep going
            if (currentlyWhitespace) {
                if (/\s/.test(character)) {
                    word.push(character);
                    continue;
                }
            } else {
                if (/\S/.test(character)) {
                    word.push(character);
                    continue;
                }
            }

            // Since it doesn't match, start a new word
            currentlyWhitespace = /\s/.test(character);
            words.push(word);
            word = [character];
        }

        // Any extra characters should be added as well
        if (word.length > 0) {
            words.push(word);
        }

        return words;
    }

    /**
     * @param words   Any number of raw dialog words.
     * @returns The words filtered using this.parseRawDialogString.
     */
    private parseRawDialogStrings(words: string[]): string[][] {
        const output: string[][] = [];

        for (const word of words) {
            output.push(...this.parseRawDialogString(word));
        }

        return output;
    }

    /**
     * @param wordRaw   A word that may need to have replacements applied.
     * @returns The same word as an Array of characters, and with replacements applied.
     */
    private filterWord(wordRaw: string | string[]): string[] {
        if (wordRaw.constructor === Array) {
            return wordRaw;
        }

        const word: string = wordRaw as string;
        const output: string[] = [];
        let inside: string | string[];

        const start = word.indexOf(this.replacerKey, 0);
        const end = word.indexOf(this.replacerKey, start + 1);

        if (start !== -1 && end !== -1) {
            inside = this.getReplacement(word.substring(start + this.replacerKey.length, end));
            if (inside.constructor === Number) {
                inside = (inside as any).toString().split("");
            } else if (inside.constructor === String) {
                inside = (inside as any).split("");
            }

            output.push(...word.substring(0, start).split(""));
            output.push(...(inside as string[]));
            output.push(...this.filterWord(word.substring(end + this.replacerKey.length)));

            return output;
        }

        return word.split("");
    }

    /**
     * Filters all String words in a menu's text using this.filterWord.
     *
     * @param words   The words to filter, as Strings or command Objects.
     * @returns The words, with all Strings filtered.
     */
    private filterMenuWords(
        words: (string | string[] | MenuWordCommand)[]
    ): (string[] | MenuWordCommand)[] {
        const output: (string[] | MenuWordCommand)[] = [];

        for (const word of words) {
            if (word.constructor === String) {
                output.push(this.filterWord(word));
            } else {
                output.push(word as MenuWordCommand);
            }
        }

        return output;
    }

    /**
     * @param textRaw   Text that, if String(s), should be filtered using this.filterWord.
     * @returns The words, filtered.
     */
    private filterText(textRaw: MenuDialogRaw): string[][] {
        if (textRaw.constructor === Array) {
            if (textRaw.length === 0) {
                return [];
            }

            if (textRaw[0].constructor === String) {
                return [textRaw as string[]];
            }

            return textRaw as string[][];
        }

        const characters: string[] = [];
        const total: string = textRaw as string;
        let component = "";
        let i: number;

        for (i = 0; i < total.length; i += 1) {
            if (/\s/.test(total[i])) {
                if (component.length > 0) {
                    characters.push(...this.filterWord(component));
                    component = "";
                }

                characters.push(total[i]);
                continue;
            }

            component += total[i];
        }

        if (component.length > 0) {
            characters.push(...this.filterWord(component));
        }

        return [characters];
    }

    /**
     * Converts a word command into its equivalent word text.
     *
     * @param wordCommand   The word command.
     * @param menu   The menu containing the word command.
     * @returns The equivalent word text for the command.
     */
    private parseWordCommand(wordCommand: MenuWordCommand, menu?: any): string[] {
        // If no menu is provided, this is from a simulation; pretend there is a menu
        if (!menu) {
            menu = {};
        }

        switch (wordCommand.command) {
            case "attribute":
                menu[wordCommand.attribute + "Old"] = menu[wordCommand.attribute];
                menu[wordCommand.attribute] = wordCommand.value;
                break;

            case "attributeReset":
                menu[wordCommand.attribute] = menu[wordCommand.attribute + "Old"];
                break;

            case "padLeft":
                return this.parseWordCommandPadLeft(wordCommand as MenuWordPadLeftCommand);

            // Position is handled directly in addMenuWord
            case "position":
                break;

            default:
                throw new Error("Unknown word command: " + (wordCommand as any).command);
        }

        return wordCommand.word!.split("");
    }

    /**
     * Converts a word command to pad text from the left.
     *
     * @param wordCommand   The word command.
     * @returns   The word command's parsed text.
     */
    private parseWordCommandPadLeft(wordCommand: MenuWordPadLeftCommand): string[] {
        const filtered: string[] = this.filterWord(wordCommand.word!);
        let length: number;

        // Length may be a String (for its length) or a direct number
        switch (wordCommand.length!.constructor) {
            case String:
                length = this.filterText(wordCommand.length as string)[0].length;
                break;

            case Number:
                length = wordCommand.length as number;
                break;

            default:
                throw new Error("Unknown padLeft command: " + wordCommand);
        }

        // Right-aligned commands reduce the amount of spacing by the length of the word
        if (wordCommand.alignRight) {
            length = Math.max(0, length - filtered.length);
        }

        // Tabs are considered to be a single space, so they're added to the left
        filtered.unshift.apply(filtered, this.stringOf("\t", length).split(""));

        return filtered;
    }

    /**
     * Retrieves the value of a text replacement of the given key.
     *
     * @param key   The key of the text replacement to retrieve.
     * @returns The value of the text replacement, if it exists.
     */
    private getReplacement(key: string): string[] {
        const replacement: string[] | ReplacerFunction = this.replacements[key];

        if (typeof replacement === "undefined") {
            return [""];
        }

        if (typeof replacement === "function") {
            return replacement(this.game);
        }

        return replacement;
    }

    /**
     * Creates a new String equivalent to an old String repeated any number of
     * times. If times is 0, a blank String is returned.
     *
     * @param text   The characters to repeat.
     * @param times   How many times to repeat (by default, 1).
     * @returns The original string, repeated.
     */
    private stringOf(text: string, times = 1): string {
        return times === 0 ? "" : new Array(times + 1).join(text);
    }

    /**
     * Predicts how wide a word's area will be when displayed as dialog.
     *
     * @param wordRaw   The word that will be displayed.
     * @param textWidth   How wide each character should be.
     * @param textPaddingX   How much space between each character.
     * @returns The total predicted width of the word's area.
     * @remarks This ignores commands under the assumption they shouldn't be
     *          used in dialogs that react to box size. This may be wrong.
     */
    private computeFutureWordLength(
        wordRaw: string[] | MenuWordCommand,
        textWidth: number,
        textPaddingX: number
    ): number {
        let total = 0;
        const word =
            wordRaw.constructor === Array
                ? wordRaw
                : this.parseWordCommand(wordRaw as MenuWordCommand);

        for (const character of word) {
            if (/\s/.test(character)) {
                total += textWidth + textPaddingX;
            } else {
                total += this.computeFutureLetterLength(character) + textPaddingX;
            }
        }

        return total;
    }

    /**
     * Predicts how wide a letter will be, based on its equivalent Actor's width.
     *
     * @param letter   The name of the letter to create.
     * @returns How wide the letter will be on the screen.
     */
    private computeFutureLetterLength(letter: string): number {
        const title = "Char" + this.getCharacterEquivalent(letter);
        const properties = this.game.objectMaker.getPrototypeOf<MenuBase>(title);

        return properties.width!;
    }
}
