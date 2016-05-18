declare module "IMapScreenr" {
    export interface IVariableFunctions {
        [i: string]: Function;
    }
    export interface IMapScreenrSettings {
        width: number;
        height: number;
        variableFunctions?: IVariableFunctions;
        variableArgs?: any[];
        variables: {
            [i: string]: any;
        };
    }
    export interface IMapScreenr {
        top: number;
        right: number;
        bottom: number;
        left: number;
        middleX: number;
        middleY: number;
        width: number;
        height: number;
        clearScreen(): void;
        setMiddleX(): void;
        setMiddleY(): void;
        setVariables(): void;
        setVariable(name: string, value?: any): any;
        shift(dx: number, dy: number): void;
        shiftX(dx: number): void;
        shiftY(dy: number): void;
        variableFunctions: IVariableFunctions;
        variableArgs: any[];
        variables: {
            [i: string]: any;
        };
    }
}
declare module "MapScreenr" {
    import { IMapScreenr, IMapScreenrSettings, IVariableFunctions } from "IMapScreenr";
    export class MapScreenr implements IMapScreenr {
        variableFunctions: IVariableFunctions;
        variableArgs: any[];
        top: number;
        right: number;
        bottom: number;
        left: number;
        middleX: number;
        middleY: number;
        width: number;
        height: number;
        variables: {
            [i: string]: any;
        };
        constructor(settings: IMapScreenrSettings);
        clearScreen(): void;
        setMiddleX(): void;
        setMiddleY(): void;
        setVariables(): void;
        setVariable(name: string, value?: any): any;
        shift(dx: number, dy: number): void;
        shiftX(dx: number): void;
        shiftY(dy: number): void;
        [i: string]: any;
    }
}
