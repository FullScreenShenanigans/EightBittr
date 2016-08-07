import { IMapScreenr, IMapScreenrSettings, IVariables, IVariableFunctions } from "./IMapScreenr";

/**
 * A flexible container for map attributes and viewport.
 */
export class MapScreenr implements IMapScreenr {
    /**
     * A listing of variable Functions to be calculated on screen resets.
     */
    public variableFunctions: IVariableFunctions;

    /**
     * Arguments to be passed into variable computation Functions.
     */
    public variableArgs: any[];

    /**
     * Top border measurement of the bounding box.
     */
    public top: number;

    /**
     * Right border measurement of the bounding box.
     */
    public right: number;

    /**
     * Bottom border measurement of the bounding box.
     */
    public bottom: number;

    /**
     * Left border measurement of the bounding box.
     */
    public left: number;

    /**
     * Constant horizontal midpoint of the bounding box, equal to (left + right) / 2.
     */
    public middleX: number;

    /**
     * Constant vertical midpoint of the bounding box, equal to (top + bottom) / 2.
     */
    public middleY: number;

    /**
     * Constant width of the bounding box.
     */
    public width: number;

    /**
     * Constant height of the bounding box.
     */
    public height: number;

    /**
     * Assorted known variables, keyed by name.
     */
    public variables: IVariables = {};

    /**
     * Resets the MapScreenr. All members of the settings argument are copied
     * to the MapScreenr itself, though only width and height are required.
     * 
     * @param {IMapScreenrSettings} settings
     */
    public constructor(settings: IMapScreenrSettings) {
        if (typeof settings === "undefined") {
            throw new Error("No settings object given to MapScreenr.");
        }
        if (typeof settings.width === "undefined") {
            throw new Error("No width given to MapScreenr.");
        }
        if (typeof settings.height === "undefined") {
            throw new Error("No height given to MapScreenr.");
        }

        if (settings.variables) {
            for (const name in settings.variables) {
                if (settings.variables.hasOwnProperty(name)) {
                    this.variables[name] = settings.variables[name];
                }
            }
        }

        this.variableFunctions = settings.variableFunctions || {};
        this.variableArgs = settings.variableArgs || [];
    }

    /**
     * Completely clears the MapScreenr for use in a new Area. Positioning is
     * reset to (0,0) and user-configured variables are recalculated.
     */
    public clearScreen(): void {
        this.left = 0;
        this.top = 0;
        this.right = this.width;
        this.bottom = this.height;

        this.setMiddleX();
        this.setMiddleY();

        this.setVariables();
    }

    /**
     * Computes middleX as the midpoint between left and right.
     */
    public setMiddleX(): void {
        this.middleX = (this.left + this.right) / 2;
    }

    /**
     * Computes middleY as the midpoint between top and bottom.
     */
    public setMiddleY(): void {
        this.middleY = (this.top + this.bottom) / 2;
    }

    /**
     * Recalculates all variables by passing variableArgs to their Functions.
     */
    public setVariables(): void {
        for (const i in this.variables) {
            if (this.variables.hasOwnProperty(i)) {
                this.setVariable(i);
            }
        }
    }

    /**
     * Recalculates a variable by passing variableArgs to its Function.
     * 
     * @param name   The name of the variable to recalculate.
     * @param value   A new value for the variable instead of its Function's result.
     * @returns The new value of the variable.
     */
    public setVariable(name: string, value?: any): any {
        this.variables[name] = arguments.length === 1
            ? this.variables[name].apply(this, this.variableArgs)
            : value;
    }

    /**
     * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
     * 
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public shift(dx: number, dy: number): void {
        if (dx) {
            this.shiftX(dx);
        }

        if (dy) {
            this.shiftY(dy);
        }
    }

    /**
     * Shifts the MapScreenr horizontally by changing left and right by the dx.
     * 
     * @param dx   How far to scroll horizontally.
     */
    public shiftX(dx: number): void {
        this.left += dx;
        this.right += dx;
    }

    /**
     * Shifts the MapScreenr vertically by changing top and bottom by the dy.
     * 
     * @param dy   How far to scroll vertically.
     */
    public shiftY(dy: number): void {
        this.top += dy;
        this.bottom += dy;
    }

    /**
     * Known variables, keyed by name.
     */
    [i: string]: any;
}
