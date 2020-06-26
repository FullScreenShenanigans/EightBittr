import { IMapScreenr, IMapScreenrSettings, IVariableFunctions, IVariables } from "./IMapScreenr";

/**
 * Flexible container for map attributes and viewport.
 */
export class MapScreenr implements IMapScreenr {
    /**
     * A listing of variable Functions to be calculated on screen resets.
     */
    public readonly variableFunctions: IVariableFunctions;

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
    public readonly width: number;

    /**
     * Constant height of the bounding box.
     */
    public readonly height: number;

    /**
     * Assorted known variables, keyed by name.
     */
    public readonly variables: IVariables = {};

    /**
     * Initializes a new instance of the MapScreenr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IMapScreenrSettings) {
        if (settings.variables !== undefined) {
            for (const name in settings.variables) {
                if ({}.hasOwnProperty.call(settings.variables, name)) {
                    this.variables[name] = settings.variables[name];
                }
            }
        }

        this.height = settings.height;
        this.width = settings.width;
        this.variableFunctions =
            settings.variableFunctions === undefined ? {} : settings.variableFunctions;
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
     * Recalculates all variables.
     */
    public setVariables(): void {
        for (const i in this.variableFunctions) {
            this.setVariable(i);
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
        this.variables[name] = arguments.length === 1 ? this.variableFunctions[name]() : value;
    }

    /**
     * Shifts the MapScreenr horizontally and vertically via shiftX and shiftY.
     *
     * @param dx   How far to scroll horizontally.
     * @param dy   How far to scroll vertically.
     */
    public shift(dx: number, dy: number): void {
        if (dx !== 0) {
            this.shiftX(dx);
        }

        if (dy !== 0) {
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
}
