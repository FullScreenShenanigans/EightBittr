import {
    Actor,
    Quadrant,
    QuadrantChangeCallback,
    QuadrantCol,
    QuadrantRow,
    QuadsKeeprSettings,
} from "./types";

/**
 * Adjustable quadrant-based collision detection.
 *
 * @template TActor   The type of Actor contained in the quadrants.
 */
export class QuadsKeepr<TActor extends Actor> {
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
    private readonly checkOffsetX: boolean;

    /**
     * Whether to factor vertical visual displacement for bounding boxes.
     */
    private readonly checkOffsetY: boolean;

    /**
     * Starting coordinates for columns.
     */
    private readonly startLeft: number;

    /**
     * Starting coordinates for rows.
     */
    private readonly startTop: number;

    /**
     * A QuadrantRow[] that holds each QuadrantRow in order.
     */
    private quadrantRows: QuadrantRow<TActor>[];

    /**
     * A QuadrantCol[] that holds each QuadrantCol in order.
     */
    private quadrantCols: QuadrantCol<TActor>[];

    /**
     * How wide Quadrants should be.
     */
    private readonly quadrantWidth: number;

    /**
     * How tall Quadrants should be.
     */
    private readonly quadrantHeight: number;

    /**
     * The groups Actors may be placed into within Quadrants.
     */
    private readonly groupNames: string[];

    /**
     * Callback for when Quadrants are added, called on the area and direction.
     */
    private readonly onAdd?: QuadrantChangeCallback;

    /**
     * Callback for when Quadrants are removed, called on the area and direction.
     */
    private readonly onRemove?: QuadrantChangeCallback;

    /**
     * Initializes a new instance of the QuadsKeepr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: QuadsKeeprSettings) {
        this.numRows = (settings.numRows ?? 0) | 0 || 2;
        this.numCols = (settings.numCols ?? 0) | 0 || 2;
        this.quadrantWidth = (settings.quadrantWidth ?? 0) | 0 || 2;
        this.quadrantHeight = (settings.quadrantHeight ?? 0) | 0 || 2;

        this.groupNames = settings.groupNames ?? [];
        this.checkOffsetX = !!settings.checkOffsetX;
        this.checkOffsetY = !!settings.checkOffsetY;

        this.onAdd = settings.onAdd;
        this.onRemove = settings.onRemove;

        this.startLeft = (settings.startLeft ?? 0) | 0;
        this.startTop = (settings.startTop ?? 0) | 0;
    }

    /**
     * @returns The listing of Quadrants grouped by row.
     */
    public getQuadrantRows(): QuadrantRow<TActor>[] {
        return this.quadrantRows;
    }

    /**
     * @returns The listing of Quadrants grouped by column.
     */
    public getQuadrantCols(): QuadrantCol<TActor>[] {
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

        let top = this.startTop;

        for (let i = 0; i < this.numRows; i += 1) {
            this.quadrantRows.push({
                left: this.startLeft,
                quadrants: [],
                top,
            });
            top += this.quadrantHeight;
        }

        let left = this.startLeft;

        for (let j = 0; j < this.numCols; j += 1) {
            this.quadrantCols.push({
                left,
                quadrants: [],
                top: this.startTop,
            });
            left += this.quadrantWidth;
        }

        top = this.startTop;

        for (let i = 0; i < this.numRows; i += 1) {
            left = this.startLeft;

            for (let j = 0; j < this.numCols; j += 1) {
                const quadrant: Quadrant<TActor> = this.createQuadrant(left, top);
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
    public shiftQuadrants(dxRaw = 0, dyRaw = 0): void {
        const dx = dxRaw | 0;
        const dy = dyRaw | 0;

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
    public pushQuadrantRow(callUpdate?: boolean): QuadrantRow<TActor> {
        const row: QuadrantRow<TActor> = this.createQuadrantRow(this.left, this.bottom);

        this.numRows += 1;
        this.quadrantRows.push(row);

        for (let i = 0; i < this.quadrantCols.length; i += 1) {
            this.quadrantCols[i].quadrants.push(row.quadrants[i]);
        }

        this.bottom += this.quadrantHeight;

        if (callUpdate && this.onAdd) {
            this.onAdd(
                "yInc",
                this.bottom,
                this.right,
                this.bottom - this.quadrantHeight,
                this.left
            );
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
    public pushQuadrantCol(callUpdate?: boolean): QuadrantCol<TActor> {
        const col: QuadrantCol<TActor> = this.createQuadrantCol(this.right, this.top);

        this.numCols += 1;
        this.quadrantCols.push(col);

        for (let i = 0; i < this.quadrantRows.length; i += 1) {
            this.quadrantRows[i].quadrants.push(col.quadrants[i]);
        }

        this.right += this.quadrantWidth;

        if (callUpdate && this.onAdd) {
            this.onAdd(
                "xInc",
                this.top,
                this.right - this.offsetY,
                this.bottom,
                this.right - this.quadrantWidth - this.offsetY
            );
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
            this.onRemove(
                "yInc",
                this.bottom,
                this.right,
                this.bottom - this.quadrantHeight,
                this.left
            );
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
            this.onRemove(
                "xDec",
                this.top,
                this.right - this.offsetY,
                this.bottom,
                this.right - this.quadrantWidth - this.offsetY
            );
        }

        this.right -= this.quadrantWidth;
    }

    /**
     * Adds a QuadrantRow to the beginning of the quadrantRows Array.
     *
     * @param callUpdate   Whether this should call the onAdd trigger
     *                    with the new row's bounding box.
     * @returns The newly created QuadrantRow.
     */
    public unshiftQuadrantRow(callUpdate?: boolean): QuadrantRow<TActor> {
        const row: QuadrantRow<TActor> = this.createQuadrantRow(
            this.left,
            this.top - this.quadrantHeight
        );

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
    public unshiftQuadrantCol(callUpdate?: boolean): QuadrantCol<TActor> {
        const col: QuadrantCol<TActor> = this.createQuadrantCol(
            this.left - this.quadrantWidth,
            this.top
        );

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
            this.onRemove(
                "yInc",
                this.top,
                this.right,
                this.top + this.quadrantHeight,
                this.left
            );
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
            this.onRemove(
                "xInc",
                this.top,
                this.left + this.quadrantWidth,
                this.bottom,
                this.left
            );
        }

        this.left += this.quadrantWidth;
    }

    public clearAllQuadrants(): void {
        for (const row of this.quadrantRows) {
            for (const quadrant of row.quadrants) {
                for (const group of this.groupNames) {
                    quadrant.numActors[group] = 0;
                }
            }
        }
    }

    /**
     * Sets an Actor to be inside a Quadrant. The two are marked so they can
     * recognize each other's existence later.
     *
     * @param actor  An Actor to be placed in the Quadrant.
     * @param quadrant   A Quadrant that now contains the Actor.
     * @param group   The grouping under which the Quadrant should store the
     *                hing.
     */
    public setActorInQuadrant(actor: TActor, quadrant: Quadrant<TActor>, group: string): void {
        // Mark the Quadrant in the Actor
        actor.quadrants[actor.numQuadrants] = quadrant;
        actor.numQuadrants += 1;

        // Mark the Actor in the Quadrant
        quadrant.actors[group][quadrant.numActors[group]] = actor;
        quadrant.numActors[group] += 1;

        // If necessary, mark the Quadrant as changed
        if (actor.changed) {
            quadrant.changed = true;
        }
    }

    /**
     * Determines the Quadrants for an entire Array of Actors. This is done by
     * wiping each quadrant's memory of that Array's group type and determining
     * each Actor's quadrants.
     *
     * @param actors   The listing of Actors in that group.
     */
    public determineGroupQuadrants(actors: TActor[]): void {
        for (const actor of actors) {
            this.determineActorQuadrants(actor);
        }
    }

    /**
     * Determines the Quadrants for a single Actor. The starting row and column
     * indices are calculated so every Quadrant within them should contain the
     * Actor. In the process, its old Quadrants and new Quadrants are marked as
     * changed if it was.
     *
     * @param actor  An Actor whose Quadrants are to be determined.
     */
    private determineActorQuadrants(actor: TActor): void {
        const groupType = actor.groupType;
        const rowStart = this.findQuadrantRowStart(actor);
        const colStart = this.findQuadrantColStart(actor);
        const rowEnd = this.findQuadrantRowEnd(actor);
        const colEnd = this.findQuadrantColEnd(actor);

        // Mark each of the Actor's Quadrants as changed
        // This is done first because the old Quadrants are changed
        if (actor.changed) {
            this.markActorQuadrantsChanged(actor);
        }

        // The actor no longer has any Quadrants: rebuild them!
        actor.numQuadrants = 0;

        for (let row = rowStart; row <= rowEnd; row += 1) {
            for (let col = colStart; col <= colEnd; col += 1) {
                this.setActorInQuadrant(actor, this.quadrantRows[row].quadrants[col], groupType);
            }
        }

        // The actor is no longer considered changed, since quadrants know it
        actor.changed = false;
    }

    /**
     * Adjusts the offset measurements by checking if rows or columns have gone
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
    private shiftQuadrant(quadrant: Quadrant<TActor>, dx: number, dy: number): void {
        quadrant.top += dy;
        quadrant.right += dx;
        quadrant.bottom += dy;
        quadrant.left += dx;
        quadrant.changed = true;
    }

    /**
     * Creates a new Quadrant using the internal ObjectMaker and sets its position.
     *
     * @param left   The horizontal displacement of the Quadrant.
     * @param top   The vertical displacement of the Quadrant.
     * @returns The newly created Quadrant.
     */
    private createQuadrant(left: number, top: number): Quadrant<TActor> {
        const quadrant: Quadrant<TActor> = {
            bottom: top + this.quadrantHeight,
            changed: true,
            left,
            numActors: {},
            right: left + this.quadrantWidth,
            actors: {},
            top,
        };

        for (const groupName of this.groupNames) {
            quadrant.actors[groupName] = [];
            quadrant.numActors[groupName] = 0;
        }

        return quadrant;
    }

    /**
     * Creates a QuadrantRow, with length determined by numCols.
     *
     * @param left   The initial horizontal displacement of the col.
     * @param top   The vertical displacement of the col.
     * @returns The newly created QuadrantRow.
     */
    private createQuadrantRow(left = 0, top = 0): QuadrantRow<TActor> {
        const row: QuadrantRow<TActor> = {
            left,
            quadrants: [],
            top,
        };

        for (let i = 0; i < this.numCols; i += 1) {
            row.quadrants.push(this.createQuadrant(left, top));
            left += this.quadrantWidth;
        }

        return row;
    }

    /**
     * Creates a QuadrantCol, with length determined by numRows.
     *
     * @param left   The horizontal displacement of the col.
     * @param top   The initial vertical displacement of the col.
     * @returns The newly created QuadrantCol.
     */
    private createQuadrantCol(left: number, top: number): QuadrantCol<TActor> {
        const col: QuadrantCol<TActor> = {
            left,
            quadrants: [],
            top,
        };

        for (let i = 0; i < this.numRows; i += 1) {
            col.quadrants.push(this.createQuadrant(left, top));
            top += this.quadrantHeight;
        }

        return col;
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The Actor's top position, accounting for vertical offset
     *          if needed.
     */
    private getTop(actor: TActor): number {
        if (this.checkOffsetY) {
            return actor.top - Math.abs(actor.offsetY!);
        }

        return actor.top;
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The Actor's right position, accounting for horizontal offset
     *          if needed.
     */
    private getRight(actor: TActor): number {
        if (this.checkOffsetX) {
            return actor.right + Math.abs(actor.offsetX!);
        }

        return actor.right;
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The Actor's bottom position, accounting for vertical
     *          offset if needed.
     */
    private getBottom(actor: TActor): number {
        if (this.checkOffsetY) {
            return actor.bottom + Math.abs(actor.offsetY!);
        }

        return actor.bottom;
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The Actor's left position, accounting for horizontal offset
     *          if needed.
     */
    private getLeft(actor: TActor): number {
        if (this.checkOffsetX) {
            return actor.left - Math.abs(actor.offsetX!);
        }

        return actor.left;
    }

    /**
     * Marks all Quadrants a Thing is contained within as changed.
     */
    private markActorQuadrantsChanged(actor: TActor): void {
        for (let i = 0; i < actor.numQuadrants; i += 1) {
            actor.quadrants[i].changed = true;
        }
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The index of the first row the Actor is inside.
     */
    private findQuadrantRowStart(actor: TActor): number {
        return Math.max(Math.floor((this.getTop(actor) - this.top) / this.quadrantHeight) - 1, 0);
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The index of the last row the Actor is inside.
     */
    private findQuadrantRowEnd(actor: TActor): number {
        return Math.min(
            Math.ceil((this.getBottom(actor) - this.top) / this.quadrantHeight),
            this.numRows - 1
        );
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The index of the first column the Actor is inside.
     */
    private findQuadrantColStart(actor: TActor): number {
        return Math.max(
            Math.floor((this.getLeft(actor) - this.left) / this.quadrantWidth) - 1,
            0
        );
    }

    /**
     * @param actor   An Actor to check the bounding box of.
     * @returns The index of the last column the Actor is inside.
     */
    private findQuadrantColEnd(actor: TActor): number {
        return Math.min(
            Math.ceil((this.getRight(actor) - this.left) / this.quadrantWidth),
            this.numCols - 1
        );
    }
}
