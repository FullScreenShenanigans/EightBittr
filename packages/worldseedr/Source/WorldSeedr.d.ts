declare module WorldSeedr {
    export interface IWorldSeedrSettings {
        /**
         * A very large listing of possibility schemas, keyed by title.
         */
        possibilities: IPossibilityContainer;

        /**
         * Function used to generate a random number, if not Math.random.
         */
        random?: () => number;

        /**
         * Function called in this.generateFull to place a child.
         */
        onPlacement?: (commands: ICommand[]) => void;

    }

    export interface IPossibilityContainer {
        [i: string]: IPossibility;
    }

    export interface IPossibility {
        "width": number;
        "height": number;
        "contents": IPossibilityContents;
    }

    export interface IPossibilityContents {
        "direction": string;
        "mode": string;
        "snap": string;
        "children": IPossibilityChild[];
        "spacing"?: number | number[] | IPossibilitySpacing;
        "limit"?: number;
        "argumentMap"?: IArgumentMap
    }

    export interface IPercentageOption {
        "percent": number;
    }

    export interface IPossibilityChild extends IPercentageOption {
        "title": string;
        "type": string;
        "arguments"?: IArgumentPossibilities[] | any;
        "source"?: string;
        "sizing"?: {
            "width"?: number;
            "height"?: number;
        };
        "stretch"?: {
            "width"?: number;
            "height"?: number;
        };
    }

    export interface IPossibilitySpacing {
        "min": number;
        "max": number;
        "units"?: number;
    }

    export interface IPossibilitySpacingOption extends IPercentageOption {
        "value": IPossibilitySpacing;
    }

    export interface IArgumentPossibilities {
        [i: number]: IArgumentPossibility
    }

    export interface IArgumentPossibility extends IPercentageOption {
        values: any[];
    }

    export interface IArgumentMap {
        [i: string]: string;
    }

    export interface IDirectionsMap {
        "top": string;
        "right": string;
        "bottom": string;
        "left": string;
    }

    export interface IPosition {
        "width": number;
        "height": number;
        "top": number;
        "right": number;
        "bottom": number;
        "left": number;
        "type"?: string;
    }

    export interface ICommand extends IPosition {
        "title": string;
        "arguments"?: IArgumentPossibilities | any;
    }

    export interface IChoice extends ICommand {
        "contents"?: IChoice;
        "children"?: IChoice[];
    }

    export interface IWorldSeedr {
        getPossibilities(): IPossibilityContainer;
        setPossibilities(possibilities: IPossibilityContainer): void;
        getOnPlacement(): (commands: ICommand[]) => void;
        setOnPlacement(onPlacement: (commands: ICommand[]) => void): void;
        clearGeneratedCommands(): void;
        runGeneratedCommands(): void;
        generate(name: string, command: IPosition | ICommand): IChoice;
        generateFull(schema: ICommand): void;
    }
}
