declare module MapScreenr {
    export interface IMapScreenrSettings {
        // How wide the MapScreenr should be.
        width: number;

        // How high the MapScreenr should be.
        height: number;

        // A mapping of Functions to generate member variables that should be
        // recomputed on screen change, keyed by variable name.
        variables?: any;

        // Arguments to be pasesd to variable Functions.
        variableArgs?: any[];
    }

    export interface IMapScreenr {
        variables: any;
        variableArgs: any[];
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
        shift(dx: number, dy: number): void;
        shiftX(dx: number): void;
        shiftY(dy: number): void;
    }
}