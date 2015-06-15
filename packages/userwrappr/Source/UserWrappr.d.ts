interface HTMLElement {
    requestFullScreen: () => void;
    webkitRequestFullScreen: () => void;
    mozRequestFullScreen: () => void;
    webkitFullscreenElement: () => void;
    cancelFullScreen: () => void;
    webkitCancelFullScreen: () => void;
    mozCancelFullScreen: () => void;
    msCancelFullScreen: () => void;
}

declare module UserWrappr {
    export interface IGameStartrConstructor {
        new (GameStartrSettings?): GameStartr.IGameStartr;
    }

    export interface IGameStartrUIHelpSettings {
        globalNameAlias: string;
        openings: string[];
        options: {
            [i: string]: IGameStartrUIHelpOption[]
        };
    }

    export interface IGameStartrUIHelpOption {
        title: string;
        description: string;
        usage?: string;
        examples?: IGameStartrUIHelpExample[];
    }

    export interface IGameStartrUIHelpExample {
        code: string;
        comment: string;
    }

    export module UISchemas {
        export interface ISchema {
            generator: string;
            title: string;
        }

        export interface IOption {
            title: string;
            source: IOptionSource;
        }

        export interface IOptionSource {
            (GameStarter: GameStartr.IGameStartr, ...args: any[]): any;
        }

        export interface IChoiceElement extends HTMLElement {
            setValue: (value: any) => void;
        }

        export interface IInputElement extends HTMLInputElement, IChoiceElement { }

        export interface ISelectElement extends HTMLSelectElement, IChoiceElement {
            valueOld?: string;
        }

        export interface IOptionsButtonsSchema extends ISchema {
            options: IOptionSource | IOptionsButtonSchema[];
            keyActive?: string;
            assumeInactive?: boolean;
        }

        export interface IOptionsButtonSchema extends IOption {
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            source: IOptionSource;
            storeLocally?: boolean;
            type: string;
        }

        export interface IOptionsTableSchema extends ISchema {
            actions?: IOptionsTableAction[];
            options: IOptionsTableOption[];
        }

        export interface IOptionsTableTypes {
            [i: string]: (input: any, details: IOptionsTableOption, schema: ISchema) => any;
        }

        export interface IOptionsTableAction {
            title: string;
            action: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableOption extends IOption {
            type: string;
            storeLocally?: boolean;
        }

        export interface IOptionsTableBooleanOption extends IOptionsTableOption {
            disable: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            enable: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            options?: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => string[];
            keyActive?: string;
            assumeInactive?: boolean;
        }

        export interface IOptionsTableKeysOption extends IOptionsTableOption {
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => string[];
        }

        export interface IOptionsTableNumberOption extends IOptionsTableOption {
            minimum: number;
            maximum: number;
            update: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableSelectOption extends IOptionsTableOption {
            options: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => string[];
            source: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            update: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
        }

        export interface IOptionsTableScreenSizeOption extends IOptionsTableOption {
            options: () => string[];
            source: () => string;
            update: (GameStarter: GameStartr.IGameStartr, value: IUserWrapprSizeSummary) => ISelectElement;
        }

        export interface IOptionsMapGridSchema extends ISchema {
            rangeX: number[];
            rangeY: number[];
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            extras?: {
                [i: string]: IOptionsMapGridExtra;
            };
        }

        export interface IOptionsMapGridExtra {
            title: string;
            callback: (GameStarter: GameStartr.IGameStartr, ...args: any[]) => void;
            extraElements: IOptionsMapGridExtraElement[];
        }

        export interface IOptionsMapGridExtraElement {
            tag: string;
            options: any;
        }
    }

    export interface IOptionsGenerator {
        generate: (schema: UISchemas.ISchema) => HTMLDivElement;
    }

    export interface IUserWrapprSizeSummary {
        width: number;
        height: number;
        name?: string;
        full?: boolean;
    }

    export interface IUISettings {
        helpSettings: IGameStartrUIHelpSettings;
        globalName: string;
        sizes: {
            [i: string]: IUserWrapprSizeSummary;
        };
        sizeDefault: string;
        schemas: UISchemas.ISchema[];
        allPossibleKeys?: string[];
        gameElementSelector?: string;
        gameControlsSelector?: string;
        log?: (...args: any[]) => void;
        customs?: GameStartr.IGameStartrCustoms;
        styleSheet?: StyleSheet;
    }

    export interface IUserWrapprSettings extends IUISettings, GameStartr.IGameStartrCustomsObject {
        GameStartrConstructor: IGameStartrConstructor;
    }

    export interface IUserWrappr {
        resetGameStarter(settings: IUserWrapprSettings, customs?: GameStartr.IGameStartrCustoms): void;
        getGameStartrConstructor(): IGameStartrConstructor;
        getGameStarter(): GameStartr.IGameStartr;
        getStatsHolder(): StatsHoldr.StatsHoldr;
        getSettings(): IUserWrapprSettings;
        getCustoms(): GameStartr.IGameStartrCustoms;
        getHelpSettings(): IGameStartrUIHelpSettings;
        getGlobalName(): string;
        getGameNameAlias(): string;
        getAllPossibleKeys(): string[];
        getSizes(): { [i: string]: IUserWrapprSizeSummary };
        getCurrentSize(): IUserWrapprSizeSummary;
        getIsFullScreen(): boolean;
        getIsPageHidden(): boolean;
        getLog(): (...args: any[]) => string;
        getGenerators(): { [i: string]: IOptionsGenerator };
        getDocumentElement(): HTMLHtmlElement;
        getRequestFullScreen(): () => void;
        getCancelFullScreen(): () => void;
        setCurrentSize(size: string | IUserWrapprSizeSummary): void;
        displayHelpMenu(): void;
        displayHelpOptions(): void;
        displayHelpGroupSummary(optionName: string): void;
        displayHelpOption(optionName: string): void;
        logHelpText(text: string): void;
        filterHelpText(text: string): string;
        padTextRight(text: string, length: number): string;
    }
}
