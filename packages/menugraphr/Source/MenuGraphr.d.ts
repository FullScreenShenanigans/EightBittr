declare module MenuGraphr {
    export interface IGameStartr extends EightBittr.IEightBittr {
        GroupHolder: GroupHoldr.IGroupHoldr;
        MapScreener: MapScreenr.IMapScreenr;
        ObjectMaker: ObjectMakr.IObjectMakr;
        TimeHandler: TimeHandlr.ITimeHandlr;
        addThing(thing: IThing | string | any[], left?: number, top?: number): IThing;
        killNormal(thing: IThing): void;
        setHeight(thing: IThing, height: number): void;
        setWidth(thing: IThing, width: number): void;
    }

    export interface IThing extends EightBittr.IThing {
        name: string;
        groupType: string;
        hidden: boolean;
    }

    export interface IMenusContainer {
        [i: string]: IMenu;
    }

    export interface IMenu extends IThing, IMenuSchema {
        children: IThing[];
        height: number;
        progress?: IMenuProgress;
        textX?: number;
        width: number;
    }

    export interface IMenuProgress {
        complete?: boolean;
        onCompletion?: (...args: any[]) => void;
        working?: boolean;
    }

    export interface IListMenu extends IListMenuSchema, IMenu {
        arrow: IThing;
        arrowXOffset?: number;
        arrowYOffset?: number;
        grid: IGridCell[][];
        gridColumns: number;
        gridRows: number;
        height: number;
        options: any[];
        optionChildren: any;
        progress: IListMenuProgress;

        /**
         * How many rows the menu has visually scrolled.
         */
        scrollingVisualOffset?: number;

        /**
         * Whether the list should be a single column, rather than auto-flow.
         */
        singleColumnList: boolean;

        selectedIndex: number[];
        textColumnWidth: number;
        width: number;
    }

    export interface IGridCell {
        column: IGridCell[];
        columnNumber: number;
        index: number;
        rowNumber: number;
        // These two will likely need to be confirmed...
        schema: (string | IMenuWordCommand)[];
        text: (string | IMenuWordCommand)[];
        title: string;
        x: number;
        y: number;
    }

    export interface IListMenuOptions {
        bottom?: any;
        options: any[] | { (): any[]; };
        selectedIndex?: number[];
    }

    export interface IListMenuProgress extends IMenuProgress {
        words: any;
        i: any;
        x: any;
        y: any;
    }

    /**
     * General attributes for both Menus and MenuSchemas.
     */
    export interface IMenuBase {
        backMenu?: string;
        callback?: (...args: any[]) => void;
        childrenSchemas?: IMenuChildSchema[];
        container?: string;
        deleteOnFinish?: boolean;
        finishAutomatically?: boolean;
        finishAutomaticSpeed?: number;
        height?: number;
        ignoreA?: boolean;
        ignoreB?: boolean;
        ignoreProgressB?: boolean;
        keepOnBack?: boolean;
        killOnB?: string[];
        onActive?: (name: string) => void;
        onBPress?: (name: string) => void;
        onDown?: (GameStartr: IGameStartr) => void;
        onInactive?: (name: string) => void;
        onLeft?: (GameStartr: IGameStartr) => void;
        onMenuDelete?: (GameStartr: IGameStartr) => void;
        onRight?: (GameStartr: IGameStartr) => void;
        onUp?: (GameStartr: IGameStartr) => void;
        size?: IMenuSchemaSize;
        startMenu?: string;
        textAreaWidth?: number;
        textArrowXOffset?: number;
        textArrowYOffset?: number;
        textHeight?: number;
        textPaddingX?: number;
        textPaddingY?: number;
        textSpeed?: number;
        textStartingX?: string;
        textWidth?: number;
        textWidthMultiplier?: number;
        textXOffset?: number;
        textYOffset?: number;
        width?: number;
    }

    export interface IMenuSchema extends IMenuBase {
        position?: IMenuSchemaPosition;
    }

    export interface IListMenuSchema extends IMenuSchema {
        scrollingItems?: number;
        scrollingItemsComputed?: boolean | number;
    }

    export interface IMenuSchemaSize {
        width?: number;
        height?: number;
    }

    export interface IMenuSchemaPosition {
        horizontal?: string;
        offset?: IMenuSchemaPositionOffset;
        relative?: boolean;
        vertical?: string;
    }

    export interface IMenuSchemaPositionOffset {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
    }

    export interface IMenuChildSchema extends IMenuSchema {
        name?: string;
        type: string;
        words?: MenuDialogRaw;
    }

    export interface IMenuChildMenuSchema extends IMenuChildSchema {
        attributes: IMenuSchema;
        name: string;
    }

    export interface IMenuWordSchema extends IMenuChildSchema {
        position: IMenuSchemaPosition;
        size: IMenuSchemaSize;
        words: (string | IMenuWordCommand)[];
    }

    export interface IMenuThingSchema extends IMenuChildSchema {
        args?: any;
        position?: IMenuSchemaPosition;
        size?: IMenuSchemaSize;
        thing: string;
    }

    export interface IMenuWordFiltered {
        length?: number | string;
        word?: string;
    }

    export type MenuDialogRaw = string | (string | string[] | (string | string[])[] | IMenuWordFiltered)[]

    export interface IMenuWordCommand extends IMenuWordFiltered {
        applyUnitsize?: boolean;
        attribute: string;
        command: string;
        value: any;
    }

    export interface IMenuWordPadLeftCommand extends IMenuWordFiltered {
        alignRight?: boolean;
    }

    export interface IMenuWordReset extends IMenuWordFiltered {
        attribute: string;
    }

    export interface IMenuWordPosition extends IMenuWordFiltered {
        x?: number;
        y?: number;
    }

    export interface IMenuWordLength extends IMenuWordFiltered { }

    export interface IText extends IThing {
        paddingY: number;
    }

    export interface IReplacements {
        [i: string]: string[] | IReplacerFunction;
    }

    export interface IReplacerFunction {
        (GameStarter: IGameStartr): string[];
    }

    export interface IMenuGraphrSettings {
        GameStarter: IGameStartr;
        schemas?: {
            [i: string]: IMenuSchema;
        };
        aliases?: {
            [i: string]: string;
        };
        replacements?: IReplacements;
        replacerKey?: string;
    }

    export interface IMenuGraphr {
        getMenus(): IMenusContainer;
        getMenu(name: string): IMenu;
        getExistingMenu(name: string): IMenu;
        getAliases(): { [i: string]: string };
        getReplacements(): IReplacements;
        createMenu(name: string, attributes?: IMenuSchema): IMenu;
        createMenuChild(name: string, schema: IMenuChildSchema): void;
        createMenuWord(name: string, schema: IMenuWordSchema): void;
        createMenuThing(name: string, schema: IMenuThingSchema): IThing;
        hideMenu(name: string): void;
        deleteMenu(name: string): void;
        deleteActiveMenu(): void;
        deleteMenuChild(child: IMenu): void;
        deleteMenuChildren(name: string): void;
        positionItem(
            item: IThing,
            size: IMenuSchemaSize,
            position: IMenuSchemaPosition,
            container: IMenu,
            skipAdd?: boolean): void;
        addMenuDialog(name: string, dialogRaw: MenuDialogRaw, onCompletion?: () => any): void;
        addMenuText(name: string, words: (string[] | IMenuWordCommand)[], onCompletion?: (...args: any[]) => void): void;
        continueMenu(name: string): void;
        addMenuList(name: string, settings: IListMenuOptions): void;
        activateMenuList(name: string): void;
        deactivateMenuList(name: string): void;
        getMenuSelectedIndex(name: string): number[];
        getMenuSelectedOption(name: string): any;
        shiftSelectedIndex(name: string, dx: number, dy: number): void;
        setSelectedIndex(name: string, x: number, y: number): void;
        adjustVerticalScrollingListThings(name: string, dy: number, textPaddingY: number): void;
        selectMenuListOption(name: string): void;
        setActiveMenu(name: string): void;
        getActiveMenu(): IMenu;
        getActiveMenuName(): string;
        registerDirection(direction: number): void;
        registerLeft(): void;
        registerRight(): void;
        registerUp(): void;
        registerDown(): void;
        registerA(): void;
        registerB(): void;
        registerStart(): void;
    }
}
