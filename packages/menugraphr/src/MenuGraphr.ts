import {
    IAliases, IGridCell, IListMenu, IListMenuOptions, IListMenuProgress,
    IMenu, IMenuChildMenuSchema, IMenuChildSchema, IMenuDialogRaw,
    IMenuGraphr, IMenuGraphrSettings, IMenusContainer, IMenuSchema,
    IMenuSchemaPosition, IMenuSchemaPositionOffset, IMenuSchemas,
    IMenuSchemaSize, IMenuThingSchema, IMenuWordCommandBase, IMenuWordCommand,
    IMenuWordPadLeftCommand, IMenuWordPosition, IMenuWordSchema, IReplacements,
    IReplacerFunction, ISoundNames, IText
} from "./IMenuGraphr";

/**
 * Cardinal directions as Numbers.
 */
export enum Direction {
    Top = 0,
    Right = 1,
    Bottom = 2,
    Left = 3
}

/**
 * A menu management system for GameStartr. Menus can have dialog-style text, scrollable
 * and unscrollable grids, and children menus or decorations added.
 */
export class MenuGraphr implements IMenuGraphr {
    /**
     * The parent IGameStartr managing Things.
     */
    private GameStarter: GameStartr.GameStartr;

    /**
     * All available menus, keyed by name.
     */
    private menus: IMenusContainer;

    /**
     * The currently "active" (user-selected) menu.
     */
    private activeMenu: IMenu;

    /**
     * Known menu schemas, keyed by name.
     */
    private schemas: IMenuSchemas;

    /**
     * A list of sounds that should be played for certain menu actions
     */
    private sounds: ISoundNames;

    /**
     * Alternate Thing titles for charactes, such as " " for "space".
     */
    private aliases: IAliases;

    /**
     * Programmatic replacements for deliniated words.
     */
    private replacements: IReplacements;

    /**
     * The separator for words to replace using replacements.
     */
    private replacerKey: string;

    /**
     * A scope to call text modifiers in, if not this.
     */
    private modifierScope: any;

    /**
     * Initializes a new instance of the MenuGraphr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IMenuGraphrSettings) {
        if (!settings) {
            throw new Error("No settings object given to MenuGraphr.");
        }
        if (!settings.GameStarter) {
            throw new Error("No GameStarter given to MenuGraphr.");
        }

        this.GameStarter = settings.GameStarter;

        this.schemas = settings.schemas || {};
        this.aliases = settings.aliases || {};
        this.replacements = settings.replacements || {};
        this.replacerKey = settings.replacerKey || "%%%%%%%";
        this.sounds = settings.sounds || {};
        this.modifierScope = settings.modifierScope || this;

        this.menus = {};
    }

    /**
     * @returns All available menus, keyed by name.
     */
    public getMenus(): IMenusContainer {
        return this.menus;
    }

    /**
     * @param name   A name of a menu.
     * @returns The menu under the given name.
     */
    public getMenu(name: string): IMenu {
        return this.menus[name];
    }

    /**
     * Returns a menu, throwing an error if it doesn't exist.
     * 
     * @param name   A name of a menu.
     * @returns The menu under the given name.
     */
    public getExistingMenu(name: string): IMenu {
        if (!this.menus[name]) {
            throw new Error("'" + name + "' menu does not exist.");
        }

        return this.menus[name];
    }

    /**
     * @returns The currently active menu.
     */
    public getActiveMenu(): IMenu {
        return this.activeMenu;
    }

    /**
     * @returns The name of the currently active menu.
     */
    public getActiveMenuName(): string {
        return this.activeMenu.name;
    }

    /**
     * @returns The alternate Thing titles for characters.
     */
    public getAliases(): IAliases {
        return this.aliases;
    }

    /**
     * @returns The programmatic replacements for deliniated words.
     */
    public getReplacements(): IReplacements {
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
    public createMenu(name: string, attributes?: IMenuSchema): IMenu {
        const schemaRaw: IMenuSchema = this.GameStarter.utilities.proliferate({}, this.schemas[name]);
        const schema: IMenuSchema = this.GameStarter.utilities.proliferate(schemaRaw, attributes);
        const menu: IMenu = this.GameStarter.ObjectMaker.make("Menu", schema);

        // If the container menu doesn't exist, a pseudo-menu the size of the screen is used
        const container: IMenu = schema.container
            ? this.menus[schema.container]
            : {
                top: 0,
                right: this.GameStarter.MapScreener.width,
                bottom: this.GameStarter.MapScreener.height,
                left: 0,
                width: Math.ceil(this.GameStarter.MapScreener.width / this.GameStarter.unitsize),
                height: Math.ceil(this.GameStarter.MapScreener.height / this.GameStarter.unitsize),
                EightBitter: this.GameStarter,
                GameStarter: this.GameStarter,
                children: []
            } as any;

        this.deleteMenu(name);

        this.menus[name] = menu;
        menu.name = name;
        this.placeMenuThing(container, menu, schema.size, schema.position);

        menu.children = [];
        menu.textAreaWidth = (menu.width - menu.textXOffset * 2) * this.GameStarter.unitsize;

        if (menu.childrenSchemas) {
            menu.childrenSchemas.forEach(this.createMenuChild.bind(this, name));
        }

        if (container.children) {
            container.children.push(menu);
        }

        this.GameStarter.utilities.proliferate(menu, attributes);

        return menu;
    }

    /**
     * Adds a child object to an existing menu.
     * 
     * @param name   The name of the existing menu.
     * @param schema   Settings for the child, including name and child type.
     * @returns The newly created Thing or Things.
     * @remarks Creating a menu is done using this.createMenu, so the created menu might
     *          not mark itself as a child of the parent.
     */
    public createMenuChild(name: string, schema: IMenuChildSchema): GameStartr.IThing | GameStartr.IThing[] {
        switch (schema.type) {
            case "menu":
                return this.createMenu((schema as IMenuChildMenuSchema).name, (schema as IMenuChildMenuSchema).attributes);

            case "text":
                return this.createMenuWord(name, schema as IMenuWordSchema);

            case "thing":
                return this.createMenuThing(name, schema as IMenuThingSchema);

            default:
                throw new Error("Unknown schema type: " + schema.type);
        }
    }

    /**
     * Creates a series of words as a child of a menu.
     * 
     * @param name   The name of the menu.
     * @param schema   Settings for the words.
     * @returns The words' character Things.
     */
    public createMenuWord(name: string, schema: IMenuWordSchema): GameStartr.IThing[] {
        const menu: IMenu = this.getExistingMenu(name);
        const container: IMenu = this.GameStarter.ObjectMaker.make("Menu");
        const words: (string[] | IMenuWordCommand)[] = this.filterMenuWords(schema.words);

        this.placeMenuThing(menu, container, schema.size, schema.position, true);
        menu.textX = container.left;

        return this.addMenuWords(name, words, 0, container.left, container.top);
    }

    /**
     * Creates a Thing as a child of a menu.
     * 
     * @param name   The name of the menu.
     * @param schema   Settings for the Thing.
     * @returns The newly created Thing.
     */
    public createMenuThing(name: string, schema: IMenuThingSchema): GameStartr.IThing {
        const menu: IMenu = this.getExistingMenu(name);
        const thing: GameStartr.IThing = this.GameStarter.ObjectMaker.make(schema.thing, schema.args);

        this.placeMenuThing(menu, thing, schema.size, schema.position);

        this.GameStarter.GroupHolder.switchMemberGroup(
            thing,
            thing.groupType,
            "Text");

        menu.children.push(thing);

        return thing;
    }

    /**
     * Hides a menu of the given name and deletes its children, if it exists.
     * 
     * @param name   The name of the menu to hide.
     */
    public hideMenu(name: string): void {
        const menu: IMenu = this.menus[name];

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
        const menu: IMenu = this.menus[name];

        if (menu) {
            this.deleteMenuChild(menu);
        }
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
            if (this.menus.hasOwnProperty(i)) {
                this.deleteMenu(i);
            }
        }
    }

    /**
     * Adds dialog-style text to a menu. If the text overflows, 
     * 
     * @param name   The name of the menu.
     * @param dialog   Raw dialog to add to the menu.
     * @param onCompletion   An optional callback for when the text is done.
     */
    public addMenuDialog(name: string, dialog: IMenuDialogRaw, onCompletion?: () => any): void {
        const dialogParsed: (string[] | IMenuWordCommand)[][] = this.parseRawDialog(dialog);
        let currentLine: number = 1;

        const callback: () => void = (): void => {
            // If all dialog has been exhausted, delete the menu and finish
            if (currentLine >= dialogParsed.length) {
                if (this.menus[name].deleteOnFinish) {
                    this.deleteMenu(name);
                }
                if (onCompletion) {
                    onCompletion();
                }
                return;
            }

            currentLine += 1;

            // Delete any previous texts. This is only done if continuing
            // so that when the dialog is finished, the last text remains
            this.deleteMenuChildren(name);

            // This continues the dialog with the next iteration (word)
            this.addMenuText(name, dialogParsed[currentLine - 1], callback);
        };

        // This first call to addMenuText shouldn't be the callback, because if 
        // being called from a childrenSchema of type "text", it shouldn't delete 
        // any other menu children from childrenSchemas.
        this.addMenuText(name, dialogParsed[0], callback);
    }

    /**
     * Continues a menu from its current display words to the next line.
     * 
     * @param name    The name of the menu.
     */
    public continueMenu(name: string): void {
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;
        const children: IText[] = menu.children as IText[];
        const progress: IListMenuProgress = menu.progress;

        if (!progress || progress.working) {
            return;
        }

        progress.working = true;

        if (progress.complete) {
            if (!progress.onCompletion || progress.onCompletion(this.GameStarter, menu)) {
                this.deleteMenu(name);
            }
            return;
        }

        for (const character of children) {
            this.GameStarter.TimeHandler.addEventInterval(
                this.scrollCharacterUp.bind(this),
                1,
                (character as IText).paddingY,
                character,
                menu,
                -1);
        }

        this.GameStarter.TimeHandler.addEvent(
            (): void => {
                this.addMenuWords(name, progress.words, progress.i, progress.x, progress.y, progress.onCompletion);
            },
            children[children.length - 1].paddingY + 1);

        if (this.sounds.onInteraction) {
            this.GameStarter.AudioPlayer.play(this.sounds.onInteraction);
        }
    }

    /**
     * Adds a list of text options to a menu.
     * 
     * @param name   The name of the menu.
     * @param settings   Settings for the list, particularly its options, starting
     *                   index, and optional floating bottom.
     */
    public addMenuList(name: string, settings: IListMenuOptions): void {
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;
        const options: any[] = settings.options.constructor === Function
            ? (settings.options as any)()
            : settings.options;
        let left: number = menu.left + menu.textXOffset * this.GameStarter.unitsize;
        let top: number = menu.top + menu.textYOffset * this.GameStarter.unitsize;
        let textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text");
        let textWidth: number = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize;
        let textHeight: number = (menu.textHeight || textProperties.height) * this.GameStarter.unitsize;
        let textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
        let selectedIndex: [number, number] = settings.selectedIndex || [0, 0];
        let optionChildren: any[] = [];
        let index: number = 0;
        let y: number = top;
        let option: any;
        let optionChild: any;
        let schema: any;
        let title: string;
        let character: GameStartr.IThing;
        let column: IGridCell[];
        let x: number;
        let i: number;
        let j: number;
        let k: number;

        menu.options = options;
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
                "option": option,
                "things": []
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

            if (option.things) {
                for (j = 0; j < option.things.length; j += 1) {
                    schema = option.things[j];
                    character = this.createMenuThing(name, schema);
                    menu.children.push(character);
                    optionChild.things.push(character);

                    if (!schema.position || !schema.position.relative) {
                        this.GameStarter.physics.shiftVert(character, y - menu.top);
                    }
                }
            }

            if (option.textsFloating) {
                for (j = 0; j < option.textsFloating.length; j += 1) {
                    schema = option.textsFloating[j];

                    optionChild.things = optionChild.things.concat(
                        this.addMenuWords(
                            name,
                            [schema.text],
                            0,
                            x + schema.x * this.GameStarter.unitsize,
                            y + schema.y * this.GameStarter.unitsize)
                    );
                }
            }

            option.schema = schema = this.filterText(option.text);

            if (schema !== "\n") {
                for (j = 0; j < schema.length; j += 1) {
                    for (k = 0; k < schema[j].length; k += 1) {
                        if (schema[j][k].command) {
                            if (schema[j][k].x) {
                                x += schema[j][k].x * this.GameStarter.unitsize;
                            }
                            if (schema[j][k].y) {
                                y += schema[j][k].y * this.GameStarter.unitsize;
                            }
                        } else {
                            option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                            character = this.GameStarter.ObjectMaker.make(title);
                            menu.children.push(character);
                            optionChild.things.push(character);

                            this.GameStarter.things.add(character, x, y);

                            x += character.width * this.GameStarter.unitsize;
                        }
                    }
                }
            }

            y += textPaddingY;

            if (!menu.singleColumnList && y > menu.bottom - textHeight + 1) {
                y = top;
                left += menu.textColumnWidth * this.GameStarter.unitsize;
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
                "option": option,
                "things": []
            };
            optionChildren.push(optionChild);

            x = menu.left + (menu.textXOffset + option.position.left) * this.GameStarter.unitsize;
            y = menu.top + (menu.textYOffset + option.position.top) * this.GameStarter.unitsize;

            option.x = x;
            option.y = y;

            // Copy & pasted from the above options loop
            // Todo: make this into its own helper function?
            for (j = 0; j < schema.length; j += 1) {
                for (k = 0; k < schema[j].length; k += 1) {
                    if (schema[j][k].command) {
                        if (schema[j][k].x) {
                            x += schema[j][k].x * this.GameStarter.unitsize;
                        }
                        if (schema[j][k].y) {
                            y += schema[j][k].y * this.GameStarter.unitsize;
                        }
                    } else if (schema[j][k] !== " ") {
                        option.title = title = "Char" + this.getCharacterEquivalent(schema[j][k]);
                        character = this.GameStarter.ObjectMaker.make(title);
                        menu.children.push(character);
                        optionChild.things.push(character);

                        this.GameStarter.things.add(character, x, y);

                        x += character.width * this.GameStarter.unitsize;
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
                for (j = 0; j < optionChild.things.length; j += 1) {
                    optionChild.things[j].hidden = true;
                }
            }
        }

        menu.selectedIndex = selectedIndex;
        menu.arrow = character = this.GameStarter.ObjectMaker.make("CharArrowRight");
        menu.children.push(character);
        character.hidden = (this.activeMenu !== menu);

        option = menu.grid[selectedIndex[0]][selectedIndex[1]];

        this.GameStarter.things.add(character);
        this.GameStarter.physics.setRight(character, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
        this.GameStarter.physics.setTop(character, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
    }

    /**
     * Retrives the currently selected grid cell of a menu.
     * 
     * @param name   The name of the menu.
     * @returns The currently selected grid cell of the menu.
     */
    public getMenuSelectedOption(name: string): IGridCell {
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;

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
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;
        const textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text");
        const textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
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
        const option: IGridCell = this.getMenuSelectedOption(name);

        if (menu.scrollingItems) {
            this.scrollListThings(name, dy, textPaddingY);
        }

        this.GameStarter.physics.setRight(menu.arrow, option.x - menu.arrowXOffset * this.GameStarter.unitsize);
        this.GameStarter.physics.setTop(menu.arrow, option.y + menu.arrowYOffset * this.GameStarter.unitsize);
    }

    /**
     * Sets the current selected index of a menu.
     * 
     * @param name   The name of the menu.
     * @param x   The new horizontal value for the index.
     * @param y   The new vertical value for the index.
     */
    public setSelectedIndex(name: string, x: number, y: number): void {
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;
        const selectedIndex: [number, number] = menu.selectedIndex;

        this.shiftSelectedIndex(name, x - selectedIndex[0], y - selectedIndex[1]);
    }

    /**
     * Sets the currently active menu.
     * 
     * @param name   The name of the menu to set as active.
     */
    public setActiveMenu(name: string): void {
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
                return this.registerUp();
            case Direction.Right:
                return this.registerRight();
            case Direction.Bottom:
                return this.registerDown();
            case Direction.Left:
                return this.registerLeft();
            default:
                throw new Error("Unknown direction: " + direction);
        }
    }

    /**
     * Reacts to a user event directing up.
     */
    public registerUp(): void {
        const menu: IListMenu = this.activeMenu as IListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, 0, -1);
        }

        if (menu.onUp) {
            menu.onUp(this.GameStarter);
        }
    }

    /**
     * Reacts to a user event directing to the right.
     */
    public registerRight(): void {
        const menu: IListMenu = this.activeMenu as IListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, 1, 0);
        }

        if (menu.onRight) {
            menu.onRight(this.GameStarter);
        }
    }

    /**
     * Reacts to a user event directing down.
     */
    public registerDown(): void {
        const menu: IListMenu = this.activeMenu as IListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, 0, 1);
        }

        if (menu.onDown) {
            menu.onDown(this.GameStarter);
        }
    }

    /**
     * Reacts to a user event directing to the left.
     */
    public registerLeft(): void {
        const menu: IListMenu = this.activeMenu as IListMenu;
        if (!menu) {
            return;
        }

        if (menu.selectedIndex) {
            this.shiftSelectedIndex(menu.name, -1, 0);
        }

        if (menu.onLeft) {
            menu.onLeft(this.GameStarter);
        }
    }

    /**
     * Reacts to a user event from pressing a selection key.
     */
    public registerA(): void {
        const menu: IMenu = this.activeMenu;

        if (!menu || menu.ignoreA) {
            return;
        }

        if (menu.callback) {
            menu.callback(menu.name);
        }

        if (this.sounds.onInteraction && (!menu.progress || !menu.progress.working)) {
            this.GameStarter.AudioPlayer.play(this.sounds.onInteraction);
        }
    }

    /**
     * Reacts to a user event from pressing a deselection key.
     */
    public registerB(): void {
        const menu: IMenu = this.activeMenu;
        if (!menu) {
            return;
        }

        if (menu.progress && !menu.ignoreProgressB) {
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

        if (this.sounds.onInteraction && (!menu.progress || !menu.progress.working)) {
            this.GameStarter.AudioPlayer.play(this.sounds.onInteraction);
        }
    }

    /**
     * Reacts to a user event from pressing a start key.
     */
    public registerStart(): void {
        const menu: IListMenu = this.activeMenu as IListMenu;
        if (!menu) {
            return;
        }

        if (menu.startMenu) {
            this.setActiveMenu(menu.startMenu);
        }
    }

    /**
     * Adds a series of words to a menu.
     * 
     * @param name   The name of the menu.
     * @param words   Words to add to the menu, as String[]s and/or commands.
     * @param onCompletion   An optional event for when the words are added.
     */
    private addMenuText(name: string, words: (string[] | IMenuWordCommand)[], onCompletion?: (...args: any[]) => void): void {
        const menu: IMenu = this.getExistingMenu(name);
        let x: number = this.GameStarter.physics.getMidX(menu);
        let y: number = menu.top + menu.textYOffset * this.GameStarter.unitsize;

        switch (menu.textStartingX) {
            case "right":
                x += menu.textAreaWidth / 2;
                break;

            case "center":
                break;

            default:
                x -= menu.textAreaWidth / 2;
        }

        menu.callback = this.continueMenu.bind(this);
        menu.textX = x;

        if (words.length) {
            this.addMenuWords(name, words, 0, x, y, onCompletion);
        } else {
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
     * @returns The generated Things from the word's characters.
     */
    private addMenuWords(
        name: string,
        words: (string[] | IMenuWordCommand)[],
        i: number,
        x: number,
        y: number,
        onCompletion?: (...args: any[]) => void): GameStartr.IThing[] {
        const menu: IMenu = this.getExistingMenu(name);
        const textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text");
        let command: IMenuWordCommandBase;
        let word: string[];
        let things: GameStartr.IThing[] = [];
        let textWidth: number;
        let textPaddingX: number;
        let textPaddingY: number;
        let textSpeed: number;
        let textWidthMultiplier: number;
        let character: IText;
        let j: number;

        // Command objects must be parsed here in case they modify the x/y position
        if ((words[i] as IMenuWordCommand).command) {
            command = words[i] as IMenuWordCommand;
            word = this.parseWordCommand(command as IMenuWordCommand, menu);

            if ((command as IMenuWordCommand).command === "position") {
                x += (command as IMenuWordPosition).x || 0;
                y += (command as IMenuWordPosition).y || 0;
            }
        } else {
            word = words[i] as string[];
        }

        textSpeed = menu.textSpeed;
        textWidth = (menu.textWidth || textProperties.width) * this.GameStarter.unitsize;
        textPaddingX = (menu.textPaddingX || textProperties.paddingX) * this.GameStarter.unitsize;
        textPaddingY = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
        textWidthMultiplier = menu.textWidthMultiplier || 1;

        // For each character in the word, schedule it appearing in the menu
        for (j = 0; j < word.length; j += 1) {
            // For non-whitespace characters, add them and move to the right
            if (/\S/.test(word[j])) {
                character = this.addMenuCharacter(name, word[j], x, y, j * textSpeed);
                x += textWidthMultiplier * (character.width * this.GameStarter.unitsize + textPaddingX);
                continue;
            }

            // Endlines skip a line; general whitespace moves to the right
            // (" " spaces at the start do not move to the right)
            if (word[j] === "\n") {
                x = menu.textX;
                y += textPaddingY;
            } else if (word[j] !== " " || x !== menu.textX) {
                x += textWidth * textWidthMultiplier;
            }
        }

        // Only create a new progress object if one doesn't exist (slight performance boost)
        if (!menu.progress) {
            menu.progress = {};
        }

        // If this is the last word in the the line (words), mark progress as done
        if (i === words.length - 1) {
            menu.progress.complete = true;
            menu.progress.onCompletion = onCompletion;

            if (menu.finishAutomatically) {
                this.GameStarter.TimeHandler.addEvent(
                    onCompletion,
                    (word.length + (menu.finishAutomaticSpeed || 1)) * textSpeed);
            }

            this.GameStarter.TimeHandler.addEvent(
                function (): void {
                    menu.progress.working = false;
                },
                (j + 1) * textSpeed);

            return things;
        }

        // If the next word would pass the edge of the menu, move down a line
        if (x + this.computeFutureWordLength(words[i + 1], textWidth, textPaddingX) >= menu.right - menu.textXOffset) {
            x = menu.textX;
            y += textPaddingY;
        }

        // Mark the menu's progress as working and incomplete
        menu.progress.working = true;
        menu.progress.complete = false;
        menu.progress.onCompletion = onCompletion;
        (menu as IListMenu).progress.words = words;
        (menu as IListMenu).progress.i = i + 1;
        (menu as IListMenu).progress.x = x;
        (menu as IListMenu).progress.y = y - textPaddingY;

        // If the bottom of the menu has been reached, pause the progress
        if (y >= menu.bottom - (menu.textYOffset - 1) * this.GameStarter.unitsize) {
            this.GameStarter.TimeHandler.addEvent(
                function (): void {
                    menu.progress.working = false;
                },
                (j + 1) * textSpeed);

            return things;
        }

        if (textSpeed) {
            this.GameStarter.TimeHandler.addEvent(
                (): void => {
                    this.addMenuWords(name, words, i + 1, x, y, onCompletion);
                },
                (j + 1) * textSpeed);
        } else {
            this.addMenuWords(name, words, i + 1, x, y, onCompletion);
        }

        return things;
    }

    /**
     * Places and positions a Thing within a menu basd on its size and position schemas.
     * 
     * @param thing   The Thing to place and position.
     * @param size   An optional description of the Thing's size.
     * @param position   An optional description of the Thing's position.
     * @param skipAdd   Whether to skip calling this.GameStarter.things.add on the Thing.
     */
    private placeMenuThing(
        menu: IMenu,
        thing: GameStartr.IThing,
        size: IMenuSchemaSize = {},
        position: IMenuSchemaPosition = {},
        skipAdd?: boolean): void {
        const offset: IMenuSchemaPositionOffset = position.offset || {};

        if (size.width) {
            this.GameStarter.physics.setWidth(thing, size.width);
        } else if (position.horizontal === "stretch") {
            this.GameStarter.physics.setLeft(thing, 0);
            this.GameStarter.physics.setWidth(thing, menu.width - (offset.left || 0) - (offset.right || 0));
        }

        if (size.height) {
            this.GameStarter.physics.setHeight(thing, size.height);
        } else if (position.vertical === "stretch") {
            this.GameStarter.physics.setTop(thing, 0);
            this.GameStarter.physics.setHeight(thing, menu.height - (offset.top || 0) - (offset.bottom || 0));
        }

        switch (position.horizontal) {
            case "center":
                this.GameStarter.physics.setMidXObj(thing, menu);
                break;
            case "right":
                this.GameStarter.physics.setRight(thing, menu.right);
                break;
            default:
                this.GameStarter.physics.setLeft(thing, menu.left);
                break;
        }

        switch (position.vertical) {
            case "center":
                this.GameStarter.physics.setMidYObj(thing, menu);
                break;
            case "bottom":
                this.GameStarter.physics.setBottom(thing, menu.bottom);
                break;
            default:
                this.GameStarter.physics.setTop(thing, menu.top);
                break;
        }

        if (offset.top) {
            this.GameStarter.physics.shiftVert(thing, position.offset.top * this.GameStarter.unitsize);
        }

        if (offset.left) {
            this.GameStarter.physics.shiftHoriz(thing, position.offset.left * this.GameStarter.unitsize);
        }

        if (!skipAdd) {
            this.GameStarter.things.add(thing, thing.left, thing.top);
        }
    }

    /**
     * Adds a single character as an GameStartr.IThing to a menu, potentially with a time delay.
     * 
     * @param name   The name of the menu.
     * @param character   The character to add.
     * @param x   The x-position of the character.
     * @param y   The y-position of the character.
     * @param delay   Optionally, how long to delay adding using TimeHandlr.
     * @returns The character's new Thing representation.
     */
    private addMenuCharacter(name: string, character: string, x: number, y: number, delay?: number): IText {
        const menu: IMenu = this.getExistingMenu(name);
        const textProperties: any = this.GameStarter.ObjectMaker.getPropertiesOf("Text");
        const textPaddingY: number = (menu.textPaddingY || textProperties.paddingY) * this.GameStarter.unitsize;
        const title: string = "Char" + this.getCharacterEquivalent(character);
        const thing: IText = this.GameStarter.ObjectMaker.make(title, {
            textPaddingY: textPaddingY
        });

        menu.children.push(thing);

        if (delay) {
            this.GameStarter.TimeHandler.addEvent(
                (): void => {
                    this.GameStarter.things.add(thing, x, y);
                },
                delay);
        } else {
            this.GameStarter.things.add(thing, x, y);
        }

        return thing;
    }

    /**
     * Scrolls a menu's character up once. If it's above the menu's area, it's deleted.
     * 
     * @param character   The Thing to scroll up.
     * @param menu 
     * @returns Whether the character was deleted.
     */
    private scrollCharacterUp(character: GameStartr.IThing, menu: IMenu): boolean {
        this.GameStarter.physics.shiftVert(character, -this.GameStarter.unitsize);

        if (character.top < menu.top + (menu.textYOffset - 1) * this.GameStarter.unitsize) {
            this.GameStarter.physics.killNormal(character);
            return true;
        }

        return false;
    }

    /**
     * Deletes all children of a menu.
     * 
     * @param name   The name of the menu.
     */
    private deleteMenuChildren(name: string): void {
        const menu: IMenu = this.menus[name];

        if (menu && menu.children) {
            menu.children.forEach((child: IMenu) => this.deleteMenuChild(child));
        }
    }

    /**
     * Deletes the child of a menu and any of its children.
     * 
     * @param child   A menu child to delete.
     */
    private deleteMenuChild(child: IMenu): void {
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

        this.GameStarter.physics.killNormal(child);
        this.deleteMenuChildren(name);

        if (child.onMenuDelete) {
            child.onMenuDelete.call(this.GameStarter);
        }

        if (child.children) {
            child.children.forEach(this.deleteMenuChild.bind(this));
        }
    }

    /**
     * Un-hides a list menu's arrow Thing.
     * 
     * @param name   The name of the menu.
     */
    private activateMenuList(name: string): void {
        const menu: IListMenu = this.menus[name] as IListMenu;

        if (menu && menu.arrow) {
            menu.arrow.hidden = false;
        }
    }

    /**
     * Hides a list menu's arrow Thing.
     * 
     * @param name   The name of the menu.
     */
    private deactivateMenuList(name: string): void {
        const menu: IListMenu = this.menus[name] as IListMenu;

        if (menu && menu.arrow) {
            menu.arrow.hidden = true;
        }
    }

    /**
     * Runs the callback for a menu's selected list option.
     * 
     * @param name   The name of the menu.
     */
    private triggerMenuListOption(name: string): void {
        const selected: IGridCell = this.getMenuSelectedOption(name);

        if (selected.callback) {
            selected.callback.call(this, name);
        }
    }

    /**
     * Determines how many scrolling items are able to fit within a list menu, as 
     * the index of the first bottom not within the menu.
     * 
     * @param menu   The list menu.
     * @returns The number of scrolling items, or Infinity if they all fit.
     */
    private computeMenuScrollingItems(menu: IListMenu): number {
        const bottom: number = menu.bottom
            - (menu.textPaddingY * this.GameStarter.unitsize || 0)
            - (menu.textYOffset * this.GameStarter.unitsize || 0);

        for (let i: number = 0; i < menu.gridRows; i += 1) {
            if (menu.grid[0][i].y >= bottom) {
                return i;
            }
        }

        return Infinity;
    }

    /**
     * Scrolls a list menu's Things vertically.
     * 
     * @param name   The name of the menu.
     * @param dy   How far along the list menu's grid to scroll.
     * @param textPaddingY   How much text is padded, to compute scrolling with dy.
     */
    private scrollListThings(name: string, dy: number, textPaddingY: number): void {
        const menu: IListMenu = this.getExistingMenu(name) as IListMenu;
        let scrollingOld: number = menu.selectedIndex[1] - dy;
        let offset: number = -dy * textPaddingY;
        let option: IGridCell;
        let optionChild: any;
        let i: number;
        let j: number;

        if (dy > 0) {
            if (scrollingOld - menu.scrollingVisualOffset < menu.scrollingItems - 1) {
                return;
            }
        } else if (scrollingOld - menu.scrollingVisualOffset > 0) {
            return;
        }

        menu.scrollingVisualOffset += dy;

        for (i = 0; i < menu.optionChildren.length; i += 1) {
            option = menu.options[i];
            optionChild = menu.optionChildren[i];

            option.y += offset;

            for (j = 0; j < optionChild.things.length; j += 1) {
                this.GameStarter.physics.shiftVert(optionChild.things[j], offset);
                if (
                    i < menu.scrollingVisualOffset
                    || i >= menu.scrollingItems + menu.scrollingVisualOffset
                ) {
                    optionChild.things[j].hidden = true;
                } else {
                    optionChild.things[j].hidden = false;
                }
            }
        }
    }

    /**
     * @param character   A String to retrieve an equivalent title of.
     * @returns The character's title from this.aliases if it exists, or the
     *          character itself otherwise.
     */
    private getCharacterEquivalent(character: string): string {
        if (this.aliases.hasOwnProperty(character)) {
            return this.aliases[character];
        }

        return character;
    }

    /**
     * @param dialogRaw   Raw dialog of any type.
     * @returns The dialog parsed into lines of words.
     */
    private parseRawDialog(dialogRaw: IMenuDialogRaw): (string[] | IMenuWordCommand)[][] {
        // A raw String becomes a single line of dialog
        if (dialogRaw.constructor === String) {
            return [this.parseRawDialogString(dialogRaw as string)];
        }

        const output: (string[] | IMenuWordCommand)[][] = [];

        for (const component of dialogRaw as string[] | string[][]) {
            if (component.constructor === String) {
                output.push(this.parseRawDialogString(component as string));
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
        let currentlyWhitespace: boolean = undefined;

        // For each character to be added...
        for (let i: number = 0; i < characters.length; i += 1) {
            // If it matches what's currently being added (whitespace or not), keep going
            if (currentlyWhitespace) {
                if (/\s/.test(characters[i])) {
                    word.push(characters[i]);
                    continue;
                }
            } else {
                if (/\S/.test(characters[i])) {
                    word.push(characters[i]);
                    continue;
                }
            }

            // Since it doesn't match, start a new word
            currentlyWhitespace = /\s/.test(characters[i]);
            words.push(word);
            word = [characters[i]];
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
            return wordRaw as string[];
        }

        const word: string = wordRaw as string;
        const output: string[] = [];
        let start: number;
        let end: number;
        let inside: string | string[];

        start = word.indexOf("%%%%%%%", 0);
        end = word.indexOf("%%%%%%%", start + 1);

        if (start !== -1 && end !== -1) {
            inside = this.getReplacement(word.substring(start + "%%%%%%%".length, end));
            if (inside.constructor === Number) {
                inside = inside.toString().split("");
            } else if (inside.constructor === String) {
                inside = (inside as string).split("");
            }

            output.push(...word.substring(0, start).split(""));
            output.push(...(inside as string[]));
            output.push(...this.filterWord(word.substring(end + "%%%%%%%".length)));

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
    private filterMenuWords(words: (string | IMenuWordCommand)[]): (string[] | IMenuWordCommand)[] {
        const output: (string[] | IMenuWordCommand)[] = [];

        for (const word of words) {
            if (word.constructor === String) {
                output.push(this.filterWord(word as string));
            } else {
                output.push(word as IMenuWordCommand);
            }
        }

        return output;
    }

    /**
     * @param textRaw   Text that, if String(s), should be filtered using this.filterWord.
     * @returns The words, filtered.
     */
    private filterText(textRaw: IMenuDialogRaw): string[][] {
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
        let total: string = textRaw as string;
        let component: string = "";
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
    private parseWordCommand(wordCommand: IMenuWordCommand, menu?: any): string[] {
        // If no menu is provided, this is from a simulation; pretend there is a menu
        if (!menu) {
            menu = {};
        }

        switch (wordCommand.command) {
            case "attribute":
                menu[wordCommand.attribute + "Old"] = menu[wordCommand.attribute];
                menu[wordCommand.attribute] = wordCommand.value;
                if (wordCommand.applyUnitsize) {
                    menu[wordCommand.attribute] *= this.GameStarter.unitsize;
                }
                break;

            case "attributeReset":
                menu[wordCommand.attribute] = menu[wordCommand.attribute + "Old"];
                break;

            case "padLeft":
                return this.parseWordCommandPadLeft(wordCommand as IMenuWordPadLeftCommand);

            // Position is handled directly in addMenuWord
            case "position":
                break;

            default:
                throw new Error("Unknown word command: " + (wordCommand as any).command);
        }

        return wordCommand.word.split("");
    }

    /**
     * Converts a word command to pad text from the left.
     * 
     * @param wordCommand   The word command.
     * @returns   The word command's parsed text.
     */
    private parseWordCommandPadLeft(wordCommand: IMenuWordPadLeftCommand): string[] {
        const filtered: string[] = this.filterWord(wordCommand.word);
        let length: number;

        // Length may be a String (for its length) or a direct number
        switch (wordCommand.length.constructor) {
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
        const replacement: string[] | IReplacerFunction = this.replacements[key];

        if (typeof replacement === "undefined") {
            return [""];
        }

        if (typeof replacement === "function") {
            return (replacement as IReplacerFunction).call(this.modifierScope, this.GameStarter);
        }

        return replacement as string[];
    }

    /**
     * Creates a new String equivalent to an old String repeated any number of
     * times. If times is 0, a blank String is returned.
     * 
     * @param text   The characters to repeat.
     * @param times   How many times to repeat (by default, 1).
     * @returns The original string, repeated.
     */
    private stringOf(text: string, times: number = 1): string {
        return (times === 0) ? "" : new Array(1 + (times)).join(text);
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
    private computeFutureWordLength(wordRaw: string[] | IMenuWordCommand, textWidth: number, textPaddingX: number): number {
        let total: number = 0;
        let word: string[];

        if (wordRaw.constructor === Array) {
            word = wordRaw as string[];
        } else {
            word = this.parseWordCommand(wordRaw as IMenuWordCommand);
        }

        for (let i: number = 0; i < word.length; i += 1) {
            if (/\s/.test(word[i])) {
                total += textWidth + textPaddingX;
            } else {
                total += this.computeFutureLetterLength(word[i]) + textPaddingX;
            }
        }

        return total;
    }

    /**
     * Predicts how wide a letter will be, based on its equivalent Thing's width.
     * 
     * @param letter   The name of the letter to create.
     * @returns How wide the letter will be on the screen.
     */
    private computeFutureLetterLength(letter: string): number {
        const title: string = "Char" + this.getCharacterEquivalent(letter);
        const properties: any = this.GameStarter.ObjectMaker.getFullPropertiesOf(title);

        return properties.width * this.GameStarter.unitsize;
    }
}
