declare module "IWorldSeedr" {
    export interface IPossibilityContainer {
        [i: string]: IPossibility;
    }
    export interface IPossibility {
        width: number;
        height: number;
        contents: IPossibilityContents;
    }
    export interface IPossibilityContents {
        direction: string;
        mode: string;
        snap: string;
        children: IPossibilityChild[];
        spacing?: Spacing;
        limit?: number;
    }
    export interface IPercentageOption {
        percent: number;
    }
    export interface IPossibilityChild extends IPercentageOption {
        title: string;
        type: string;
        arguments?: IArgumentPossibility[] | any;
        source?: string;
        sizing?: {
            width?: number;
            height?: number;
        };
        stretch?: {
            width?: number;
            height?: number;
        };
    }
    export interface IPossibilitySpacing {
        min: number;
        max: number;
        units?: number;
    }
    export interface IPossibilitySpacingOption extends IPercentageOption {
        value: IPossibilitySpacing;
    }
    export interface IArgumentPossibility extends IPercentageOption {
        values: IArgumentMap;
    }
    export interface IArgumentMap {
        [i: string]: any;
        width?: any;
        height?: any;
    }
    export interface IDirectionsMap {
        top: string;
        right: string;
        bottom: string;
        left: string;
    }
    export interface IPosition {
        width: number;
        height: number;
        top: number;
        right: number;
        bottom: number;
        left: number;
    }
    export interface ICommand extends IPosition {
        title: string;
        arguments?: IArgumentMap;
    }
    export interface IChoice extends ICommand {
        type?: string;
        contents?: IChoice;
        children?: IChoice[];
    }
    export interface IRandomNumberGenerator {
        (): number;
    }
    export type Spacing = number | number[] | IPossibilitySpacing | IPossibilitySpacingOption[];
    export interface IOnPlacement {
        (commands: ICommand[]): void;
    }
    export interface IWorldSeedrSettings {
        possibilities: IPossibilityContainer;
        random?: IRandomNumberGenerator;
        onPlacement?: IOnPlacement;
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
declare module "ISpacingCalculator" {
    import { IPercentageOption, IPossibilitySpacing, IPossibilitySpacingOption, Spacing } from "IWorldSeedr";
    export interface IRandomBetweenGenerator {
        (min: number, max: number): number;
    }
    export interface IOptionChooser<T extends IPercentageOption> {
        (choices: T[]): T;
    }
    export interface ISpacingCalculator {
        calculateFromSpacing(spacing: Spacing): number;
        calculateFromPossibility(spacing: IPossibilitySpacing): number;
        calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number;
    }
}
declare module "SpacingCalculator" {
    import { IOptionChooser, ISpacingCalculator, IRandomBetweenGenerator } from "ISpacingCalculator";
    import { IPossibilitySpacing, IPossibilitySpacingOption, IRandomNumberGenerator, Spacing } from "IWorldSeedr";
    export class SpacingCalculator implements ISpacingCalculator {
        randomBetween: IRandomBetweenGenerator;
        chooseAmong: IOptionChooser<IPossibilitySpacingOption>;
        constructor(randomBetween: IRandomNumberGenerator, chooseAmong: IOptionChooser<IPossibilitySpacingOption>);
        calculateFromSpacing(spacing: Spacing): number;
        calculateFromPossibility(spacing: IPossibilitySpacing): number;
        calculateFromPossibilities(spacing: IPossibilitySpacingOption[]): number;
    }
}
declare module "WorldSeedr" {
    import { IChoice, ICommand, IOnPlacement, IPosition, IPossibilityContainer, IWorldSeedr, IWorldSeedrSettings } from "IWorldSeedr";
    export class WorldSeedr implements IWorldSeedr {
        private possibilities;
        private random;
        private onPlacement;
        private generatedCommands;
        private spacingCalculator;
        constructor(settings: IWorldSeedrSettings);
        getPossibilities(): IPossibilityContainer;
        setPossibilities(possibilities: IPossibilityContainer): void;
        getOnPlacement(): IOnPlacement;
        setOnPlacement(onPlacement: IOnPlacement): void;
        clearGeneratedCommands(): void;
        runGeneratedCommands(): void;
        generate(name: string, command: IPosition | ICommand): IChoice;
        generateFull(schema: ICommand): void;
        private generateChildren(schema, position, direction?);
        private generateCertain(contents, position, direction, spacing);
        private generateRepeat(contents, position, direction, spacing);
        private generateRandom(contents, position, direction, spacing);
        private generateMultiple(contents, position, direction, spacing);
        private generateChild(contents, position, direction);
        private parseChoice(choice, position, direction);
        private parseChoiceFinal(choice, position, direction);
        private chooseAmong<T>(choices);
        private chooseAmongPosition(choices, position);
        private choiceFitsSize(choice, width, height);
        private choiceFitsPosition(choice, position);
        private positionIsNotEmpty(position, direction);
        private shrinkPositionByChild(position, child, direction, spacing?);
        private movePositionBySpacing(position, direction, spacing?);
        private wrapChoicePositionExtremes(children);
        private ensureSizingOnChoice(output, choice, schema);
        private ensureDirectionBoundsOnChoice(output, position);
        private randomPercentage();
        private randomBetween(min, max);
        private objectCopy(original);
        private objectMerge(primary, secondary);
    }
}
