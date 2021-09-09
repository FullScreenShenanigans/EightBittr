/**
 * Container for a single sprite.
 */
export class SpriteSingle {
    /**
     * Raw sprite data.
     */
    public readonly data: Uint8ClampedArray;

    /**
     * A canvas with the rendered sprite, once created.
     */
    private canvas: HTMLCanvasElement | undefined;

    /**
     * Prepared canvas pattern to be drawn, once created.
     */
    private pattern: CanvasPattern | undefined;

    /**
     * Initializes a new instance of the SpriteSingle class.
     *
     * @param data   Raw sprite data.
     */
    public constructor(data: Uint8ClampedArray) {
        this.data = data;
    }

    /**
     * Gets a canvas with the rendered sprite, creating it if it didn't already exist.
     *
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    public getCanvas(width: number, height: number): HTMLCanvasElement {
        if (!this.canvas) {
            this.canvas = this.createCanvas(width, height);
        }

        return this.canvas;
    }

    /**
     * Gets a context pattern with the rendered sprite, creating it if it didn't already exist.
     *
     * @param width   Width of the context pattern.
     * @param height   Height of the context pattern.
     * @returns A context pattern with the rendered sprite.
     */
    public getPattern(context: CanvasRenderingContext2D, width: number, height: number) {
        if (!this.pattern) {
            this.pattern = context.createPattern(this.getCanvas(width, height), "repeat")!;
        }

        return this.pattern;
    }

    /**
     * Creates a canvas with the rendered sprite.
     *
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d")!;
        context.imageSmoothingEnabled = false;

        const imageData = context.getImageData(0, 0, width, height);
        imageData.data.set(this.data.slice(0, Math.min(imageData.data.length, this.data.length)));
        context.putImageData(imageData, 0, 0);

        return canvas;
    }
}
