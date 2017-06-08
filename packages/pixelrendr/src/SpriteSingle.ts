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
     * Creates a canvas with the rendered sprite.
     *
     * @param width   Width of the canvas.
     * @param height   Height of the canvas.
     * @returns A canvas with the rendered sprite.
     */
    private createCanvas(width: number, height: number): HTMLCanvasElement {
        const canvas: HTMLCanvasElement = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const context: CanvasRenderingContext2D = canvas.getContext("2d")!;
        const imageData: ImageData = context.getImageData(0, 0, width, height);

        imageData.data.set(this.data);
        context.putImageData(imageData, 0, 0);

        return canvas;
    }
}
