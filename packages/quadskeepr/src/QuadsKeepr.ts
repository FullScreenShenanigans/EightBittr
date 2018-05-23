import {
    IQuadrant, IQuadrantChangeCallback, IQuadrantCol, IQuadrantFactory,
    IQuadrantRow, IQuadsKeepr, IQuadsKeeprSettings, IThing,
} from "./IQuadsKeepr";

/**
 * Adjustable quadrant-based collision detection.
 *
 * @template TThing   The type of Thing contained in the quadrants.
 */
export class QuadsKeepr<TThing extends IThing> implements IQuadsKeepr<TThing> {
    /**
     * The top boundary for all quadrants.
     */
    public top: number;

    /**
     * The right boundary for all quadrants.
     */
    public right: number;

    /**
     * The bottom boundary for all quadrants.
     */
    public bottom: number;

    /**
     * The left boundary for all quadrants.
     */
    public left: number;

    /**
     * Creates new Quadrants.
     */
    private readonly quadrantFactory: IQuadrantFactory<TThing>;

    /**
     * How many rows of Quadrants there should be initially.
     */
    private numRows: number;

    /**
     * How many columns of Quadrants there should be initially.
     */
    private numCols: number;

    /**
     * Horizontal scrolling offset during gameplay.
     */
    private offsetX: number;

    /**
     * Vertical scrolling offset during gameplay.
     */
    private offsetY: number;

    /**
     * Whether to factor horizontal visual displacement for bounding boxes.
     */
    private checkOffsetX: boolean;

    /**
     * Whether to factor vertical visual displacement for bounding boxes.
     */
    private checkOffsetY: boolean;

    /**
     * Starting coordinates for columns.
     */
    private startLeft: number;

    /**
     * Starting coordinates for rows.
     */
    private startTop: number;

    /**
     * A QuadrantRow[] that holds each QuadrantRow in order.
     */
    private quadrantRows: IQuadrantRow<TThing>[];

    /**
     * A QuadrantCol[] that holds each QuadrantCol in order.
     */
    private quadrantCols: IQuadrantCol<TThing>[];

    /**
     * How wide Quadrants should be.
     */
    private quadrantWidth: number;

    /**
     * How tall Quadrants should be.
     */
    private quadrantHeight: number;

    /**
     * The groups Things may be placed into within Quadrants.
     */
    private groupNames: string[];

    /**
     * Callback for when Quadrants are added, called on the area and direction.
     */
    private onAdd?: IQuadrantChangeCallback;

    /**
     * Callback for when Quadrants are removed, called on the area and direction.
     */
    private onRemove?: IQuadrantChangeCallback;

    /**
     * Initializes a new instance of the QuadsKeepr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IQuadsKeeprSettings<TThing>) {
        if (!settings) {
            throw new Error("No settings object given to QuadsKeepr.");
        }
        if (!settings.quadrantFactory) {
            throw new Error("No quadrantFactory given to QuadsKeepr.");
        }

        this.quadrantFactory = settings.quadrantFactory;
        this.numRows = ((settings.numRows || 0) | 0) || 2;
        this.numCols = ((settings.numCols || 0) | 0) || 2;
        this.quadrantWidth = ((settings.quadrantWidth || 0) | 0) || 2;
        this.quadrantHeight = ((settings.quadrantHeight || 0) | 0) || 2;

        this.groupNames = settings.groupNames || [];
        this.checkOffsetX = !!settings.checkOffsetX;
        this.checkOffsetY = !!settings.checkOffsetY;

        this.onAdd = settings.onAdd;
        this.onRemove = settings.onRemove;

        this.startLeft = (settings.startLeft || 0) | 0;
        this.startTop = (settings.startTop || 0) | 0;
    }

    /**
     * @returns The listing of Quadrants grouped by row.
     */
    public getQuadrantRows(): IQuadrantRow<TThing>[] {
        return this.quadrantRows;
    }

    /**
     * @returns The listing of Quadrants grouped by column.
     */
    public getQuadrantCols(): IQuadrantCol<TThing>[] {
        return this.quadrantCols;
    }

    /**
     * @returns How many Quadrant rows there are.
     */
    public getNumRows(): number {
        return this.numRows;
    }

    /**
     * @returns How many Quadrant columns there are.
     */
    public getNumCols(): number {
        return this.numCols;
    }

    /**
     * @returns How wide each Quadrant is.
     */
    public getQuadrantWidth(): number {
        return this.quadrantWidth;
    }

    /**
     * @returns How high each Quadrant is.
     */
    public getQuadrantHeight(): number {
        return this.quadrantHeight;
    }

    /**
     * Completely resets all Quadrants. The grid structure of rows and columns
     * is remade with new Quadrants according to startLeft and startTop.
     */
    public resetQuadrants(): void {
        this.top = this.startTop;
        this.right = this.startLeft + this.quadrantWidth * this.numCols;
        this.bottom = this.startTop + this.quadrantHeight * this.numRows;
        this.left = this.startLeft;

        this.quadrantRows = [];
        this.quadrantCols = [];

        this.offsetX = 0;
        this.offsetY = 0;

        let top: number = this.startTop;

        for (let i = 0; i < this.numRows; i += 1) {
            this.quadrantRows.push({
                left: this.startLeft,
                top,
                quadrants: [],
            });
            top += this.quadrantHeight;
        }

        let left: number = this.startLeft;

        for (let j = 0; j < this.numCols; j += 1) {
            this.quadrantCols.push({
                left,
                top: this.startTop,
                quadrants: [],
            });
            left += this.quadrantWidth;
        }

        top = this.startTop;

        for (let i = 0; i < this.numRows; i += 1) {
            left = this.startLeft;

            for (let j = 0; j < this.numCols; j += 1) {
                const quadrant: IQuadrant<TThing> = this.createQuadrant(left, top);
                this.quadrantRows[i].quadrants.push(quadrant);
                this.quadrantCols[j].quadrants.push(quadrant);
                left += this.quadrantWidth;
            }

            top += this.quadrantHeight;
        }

        if (this.onAdd) {
            this.onAdd("xInc", this.top, this.right, this.bottom, this.left);
        }
    }

    /**
     * Shifts each Quadrant horizontally and vertically, along with the row and
     * column containers. Offsets are adjusted to check for row or column
     * deletion and insertion.
     *
     * @param dxRaw   How much to shift horizontally (will be rounded).
     * @param dyRaw   How much to shift vertically (will be rounded).
     */
    public shiftQuadrants(dxRaw: number = 0, dyRaw: number = 0): void {
        const dx: number = dxRaw | 0;
        const dy: number = dyRaw | 0;

        this.offsetX += dx;
        this.offsetY += dy;

        this.top += dy;
        this.right += dx;
        this.bottom += dy;
        this.left += dx;

        for (let row = 0; row < this.numRows; row += 1) {
            this.quadrantRows[row].left += dx;
            this.quadrantRows[row].top += dy;
        }

        for (let col = 0; col < this.numCols; col += 1) {
            this.quadrantCols[col].left += dx;
            this.quadrantCols[col].top += dy;
        }

        for (let row = 0; row < this.numRows; row += 1) {
            for (let col = 0; col < this.numCols; col += 1) {
                this.shiftQuadrant(this.quadrantRows[row].quadrants[col], dx, dy);
            }
        }

        this.adjustOffsets();
    }

    /**
     * Adds a QuadrantRow to the end of the quadrantRows Array.
     *
     * @param callUpdate   Whether this should call the onAdd trigger
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    public pushQuadrantRow(callUpdate?: boolean): IQuadrantRow<TThing> {
        const row: IQuadrantRow<TThing> = this.createQuadrantRow(this.left, this.bottom);

        this.numRows += 1;
        this.quadrantRows.push(row);

        for (let i = 0; i < this.quadrantCols.length; i += 1) {
            this.quadrantCols[i].quadrants.push(row.quadrants[i]);
        }

        this.bottom += this.quadrantHeight;

        if (callUpdate && this.onAdd) {
            this.onAdd("yInc", this.bottom, this.right, this.bottom - this.quadrantHeight, this.left);
        }

        return row;
    }

    /**
     * Adds a QuadrantCol to the end of the quadrantCols Array.
     *
     * @param callUpdate   Whether this should call the onAdd trigger
     *                     with the new col's bounding box.
     * @returns The newly created QuadrantCol.
     */
    public pushQuadrantCol(callUpdate?: boolean): IQuadrantCol<TThing> {
        const col: IQuadrantCol<TThing> = this.createQuadrantCol(this.right, this.top);

        this.numCols += 1;
        this.quadrantCols.push(col);

        for (let i = 0; i < this.quadrantRows.length; i += 1) {
            this.quadrantRows[i].quadrants.push(col.quadrants[i]);
        }

        this.right += this.quadrantWidth;

        if (callUpdate && this.onAdd) {
            this.onAdd("xInc", this.top, this.right - this.offsetY, this.bottom, this.right - this.quadrantWidth - this.offsetY);
        }

        return col;
    }

    /**
     * Removes the last QuadrantRow from the end of the quadrantRows Array.
     *
     * @param callUpdate   Whether this should call the onRemove trigger
     *                     with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    public popQuadrantRow(callUpdate?: boolean): void {
        for (const col of this.quadrantCols) {
            col.quadrants.pop();
        }

        this.numRows -= 1;
        this.quadrantRows.pop();

        if (callUpdate && this.onRemove) {
            this.onRemove("yInc", this.bottom, this.right, this.bottom - this.quadrantHeight, this.left);
        }

        this.bottom -= this.quadrantHeight;
    }

    /**
     * Removes the last QuadrantCol from the end of the quadrantCols Array.
     *
     * @aram callUpdate   Whether this should call the onRemove trigger
     *                    with the new row's bounding box.
     */
    public popQuadrantCol(callUpdate?: boolean): void {
        for (const row of this.quadrantRows) {
            row.quadrants.pop();
        }

        this.numCols -= 1;
        this.quadrantCols.pop();

        if (callUpdate && this.onRemove) {
            this.onRemove("xDec", this.top, this.right - this.offsetY, this.bottom, this.right - this.quadrantWidth - this.offsetY);
        }

        this.right -= this.quadrantWidth;
    }

    /**
     * Adds a QuadrantRow to the beginning of the quadrantRows Array.
     *
     * @paam callUpdate   Whether this should call the onAdd trigger
     *                    with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    public unshiftQuadrantRow(callUpdate?: boolean): IQuadrantRow<TThing> {
        const row: IQuadrantRow<TThing> = this.createQuadrantRow(this.left, this.top - this.quadrantHeight);

        this.numRows += 1;
        this.quadrantRows.unshift(row);

        for (let i = 0; i < this.quadrantCols.length; i += 1) {
            this.quadrantCols[i].quadrants.unshift(row.quadrants[i]);
        }

        this.top -= this.quadrantHeight;

        if (callUpdate && this.onAdd) {
            this.onAdd("yDec", this.top, this.right, this.top + this.quadrantHeight, this.left);
        }

        return row;
    }

    /**
     * Adds a QuadrantCol to the beginning of the quadrantCols Array.
     *
     * @para callUpdate   Whether this should call the onAdd trigger
     *                    with the new row's bounding box.
     * @returns The newly created QuadrantCol.
     */
    public unshiftQuadrantCol(callUpdate?: boolean): IQuadrantCol<TThing> {
        const col: IQuadrantCol<TThing> = this.createQuadrantCol(this.left - this.quadrantWidth, this.top);

        this.numCols += 1;
        this.quadrantCols.unshift(col);

        for (let i = 0; i < this.quadrantRows.length; i += 1) {
            this.quadrantRows[i].quadrants.unshift(col.quadrants[i]);
        }

        this.left -= this.quadrantWidth;

        if (callUpdate && this.onAdd) {
            this.onAdd("xDec", this.top, this.left, this.bottom, this.left + this.quadrantWidth);
        }

        return col;
    }

    /**
     * Removes a QuadrantRow from the beginning of the quadrantRows Array.
     *
     * @param allUpdate   Whether this should call the onAdd trigger
     *                    with the new row's bounding box.
     */
    public shiftQuadrantRow(callUpdate?: boolean): void {
        for (const col of this.quadrantCols) {
            col.quadrants.shift();
        }

        this.numRows -= 1;
        this.quadrantRows.pop();

        if (callUpdate && this.onRemove) {
            this.onRemove("yInc", this.top, this.right, this.top + this.quadrantHeight, this.left);
        }

        this.top += this.quadrantHeight;
    }

    /**
     * Removes a QuadrantCol from the beginning of the quadrantCols Array.
     *
     * @param calUpdate   Whether this should call the onAdd trigger
     *                    with the new row's bounding box.
     */
    public shiftQuadrantCol(callUpdate?: boolean): void {
        for (const row of this.quadrantRows) {
            row.quadrants.shift();
        }

        this.numCols -= 1;
        this.quadrantCols.pop();

        if (callUpdate && this.onRemove) {
            this.onRemove("xInc", this.top, this.left + this.quadrantWidth, this.bottom, this.left);
        }

        this.left += this.quadrantWidth;
    }

    /**
     * Determines the Quadrants for an entire Array of Things. This is done by
     * wiping each quadrant's memory of that Array's group type and determining
     * each Thing's quadrants.
     *
     * @param grou   The name of the group to have Quadrants determined.
     * @param things   The listing of Things in that group.
     */
    public determineAllQuadrants(group: string, things: TThing[]): void {
        for (let row = 0; row < this.numRows; row += 1) {
            for (let col = 0; col < this.numCols; col += 1) {
                this.quadrantRows[row].quadrants[col].numthings[group] = 0;
            }
        }

        for (const thing of things) {
            this.determineThingQuadrants(thing);
        }
    }

    /**
     * Determines the Quadrants for a single Thing. The starting row and column
     * indices are calculated so every Quadrant within them should contain the
     * Thing. In the process, its old Quadrants and new Quadrants are marked as
     * changed if i was.
     *
     * @param thing  A Thing whose Quadrants are to be determined.
     */
    public determineThingQuadrants(thing: TThing): void {
        const groupType: string = thing.groupType;
        const rowStart: number = this.findQuadrantRowStart(thing);
        const colStart: number = this.findQuadrantColStart(thing);
        const rowEnd: number = this.findQuadrantRowEnd(thing);
        const colEnd: number = this.findQuadrantColEnd(thing);

        // Mark each of the Thing's Quadrants as changed
        // This is done first because the old Quadrants are changed
        if (thing.changed) {
            this.markThingQuadrantsChanged(thing);
        }

        // The thing no longer has any Quadrants: rebuild them!
        thing.numQuadrants = 0;

        for (let row: number = rowStart; row <= rowEnd; row += 1) {
            for (let col: number = colStart; col <= colEnd; col += 1) {
                this.setThingInQuadrant(thing, this.quadrantRows[row].quadrants[col], groupType);
            }
        }

        // The thing is no longer considered changed, since quadrants know it
        thing.changed = false;
    }

    /**
     * Sets a Thing to be inside a Quadrant. The two are marked so they can
     * recognize each other's existence later.
     *
     * @param thing  A Thing to be placed in the Quadrant.
     * @param quadrant   A Quadrant that now contains the Thing.
     * @param group   The grouping under which the Quadrant should store the
     *                hing.
     */
    public setThingInQuadrant(thing: TThing, quadrant: IQuadrant<TThing>, group: string): void {
        // Mark the Quadrant in the Thing
        thing.quadrants[thing.numQuadrants] = quadrant;
        thing.numQuadrants += 1;

        // Mark the Thing in the Quadrant
        quadrant.things[group][quadrant.numthings[group]] = thing;
        quadrant.numthings[group] += 1;

        // If necessary, mark the Quadrant as changed
        if (thing.changed) {
            quadrant.changed = true;
        }
    }

    /**
     * Adjusts the offst measurements by checking if rows or columns have gone
     * over the limit, which requires rows or columns be removed and new ones
     * added.
     */
    private adjustOffsets(): void {
        // Quadrant shift: add to the right
        while (-this.offsetX > this.quadrantWidth) {
            this.shiftQuadrantCol(true);
            this.pushQuadrantCol(true);
            this.offsetX += this.quadrantWidth;
        }

        // Quadrant shift: add to the left
        while (this.offsetX > this.quadrantWidth) {
            this.popQuadrantCol(true);
            this.unshiftQuadrantCol(true);
            this.offsetX -= this.quadrantWidth;
        }

        // Quadrant shift: add to the bottom
        while (-this.offsetY > this.quadrantHeight) {
            this.unshiftQuadrantRow(true);
            this.pushQuadrantRow(true);
            this.offsetY += this.quadrantHeight;
        }

        // Quadrant shift: add to the top
        while (this.offsetY > this.quadrantHeight) {
            this.popQuadrantRow(true);
            this.unshiftQuadrantRow(true);
            this.offsetY -= this.quadrantHeight;
        }
    }

    /**
     * Shifts a Quadrant horizontally and vertically.
     *
     * @param dx   How mch to shift horizontally.
     * @param dy   How much to shift vertically.
     */
    private shiftQuadrant(quadrant: IQuadrant<TThing>, dx: number, dy: number): void {
        quadrant.top += dy;
        quadrant.right += dx;
        quadrant.bottom += dy;
        quadrant.left += dx;
        quadrant.changed = true;
    }

    /**
     * Creates a new Quadrant using the internal ObjectMaker and sets its position.
     *
     * @param left   The orizontal displacement of the Quadrant.
     * @param top   The vertical displacement of the Quadrant.
     * @returns The newly created Quadrant.
     */
    private createQuadrant(left: number, top: number): IQuadrant<TThing> {
        const quadrant: IQuadrant<TThing> = this.quadrantFactory();

        quadrant.changed = true;
        quadrant.things = {};
        quadrant.numthings = {};

        for (const groupName of this.groupNames) {
            quadrant.things[groupName] = [];
            quadrant.numthings[groupName] = 0;
        }

        quadrant.left = left;
        quadrant.top = top;
        quadrant.right = left + this.quadrantWidth;
        quadrant.bottom = top + this.quadrantHeight;

        return quadrant;
    }

    /**
     * Creates a QuadrantRow, with length determined by numCols.
     *
     * @param left   The initial horizontal displacement of the col.
     * @param top   The vertical displacement of the col.
     * @returns The newly created QuadrantRow.
     */
    private createQuadrantRow(left: number = 0, top: number = 0): IQuadrantRow<TThing> {
        const row: IQuadrantRow<TThing> = {
            left,
            top,
            quadrants: [],
        };

        for (let i = 0; i < this.numCols; i += 1) {
            row.quadrants.push(this.createQuadrant(left, top));
            // tslint:disable-next-line:no-parameter-reassignment
            left += this.quadrantWidth;
        }

        return row;
    }

    /**
     * Creates a QuadrantCol, with length determined by numRows.
     *
     * @param left   The hoizontal displacement of the col.
     * @param top   The initial vertical displacement of the col.
     * @returns The newly created QuadrantCol.
     */
    private createQuadrantCol(left: number, top: number): IQuadrantCol<TThing> {
        const col: IQuadrantCol<TThing> = {
            left,
            top,
            quadrants: [],
        };

        for (let i = 0; i < this.numRows; i += 1) {
            col.quadrants.push(this.createQuadrant(left, top));
            top += this.quadrantHeight;
        }

        return col;
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The Thing's top position, accounting for vertical offset
     *          if needed.
     */
    private getTop(thing: TThing): number {
        if (this.checkOffsetY) {
            return thing.top - Math.abs(thing.offsetY!);
        }

        return thing.top;
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The Thing's right position, accounting for horizontal offset
     *          if needed.
     */
    private getRight(thing: TThing): number {
        if (this.checkOffsetX) {
            return thing.right + Math.abs(thing.offsetX!);
        } else {
            return thing.right;
        }
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The Thing's bottom position, accounting for vertical
     *          offset if needd.
     */
    private getBottom(thing: TThing): number {
        if (this.checkOffsetY) {
            return thing.bottom + Math.abs(thing.offsetY!);
        } else {
            return thing.bottom;
        }
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The Thing's left position, accounting for horizontal offset
     *          if needed.
     */
    private getLeft(thing: TThing): number {
        if (this.checkOffsetX) {
            return thing.left - Math.abs(thing.offsetX!);
        } else {
            return thing.left;
        }
    }

    /**
     * Marks all Quadrants a Thig is contained within as changed.
     */
    private markThingQuadrantsChanged(thing: TThing): void {
        for (let i = 0; i < thing.numQuadrants; i += 1) {
            thing.quadrants[i].changed = true;
        }
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The index of the first row the Thing is inside.
     */
    private findQuadrantRowStart(thing: TThing): number {
        return Math.max(Math.floor((this.getTop(thing) - this.top) / this.quadrantHeight), 0) - 1;
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The index of the last row the Thing is inside.
     */
    private findQuadrantRowEnd(thing: TThing): number {
        return Math.min(Math.ceil((this.getBottom(thing) - this.top) / this.quadrantHeight), this.numRows - 1);
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The index of the first column the Thing is inside.
     */
    private findQuadrantColStart(thing: TThing): number {
        return Math.max(Math.floor((this.getLeft(thing) - this.left) / this.quadrantWidth), 0) - 1;
    }

    /**
     * @param thing   A Thing to check the bounding box of.
     * @returns The index of the last column the Thing is inside.
     */
    private findQuadrantColEnd(thing: TThing): number {
        return Math.min(Math.ceil((this.getRight(thing) - this.left) / this.quadrantWidth), this.numCols - 1);
    }
}
