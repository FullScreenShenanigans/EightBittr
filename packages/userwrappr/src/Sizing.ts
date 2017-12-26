/**
 * Resolved numeric rectangular size.
 */
export interface IAbsoluteSizeSchema {
    /**
     * Height of the rectangle.
     */
    height: number;

    /**
     * Width of the rectangle.
     */
    width: number;
}

/**
 * User-friendly size as a number of pixels or percentage.
 */
export type IRelativeSize = number | string;

/**
 * User-friendly rectangular size.
 */
export interface IRelativeSizeSchema {
    /**
     * Height of the rectangle.
     */
    height: IRelativeSize;

    /**
     * Width of the rectangle.
     */
    width: IRelativeSize;
}

/**
 * Converts a relative size to its absolute pixel number.
 *
 * @param container   Containing area for the relative size.
 * @param relative   User-friendly relative size.
 * @returns The absolute pixel number equivalent for the size.
 */
const convertRelativeToAbsoluteSize = (container: number, relative: IRelativeSize): number => {
    if (typeof relative === "number") {
        return relative;
    }

    if (!/^(\d+)\%$/.test(relative)) {
        throw new Error("Relative size should be in percentage form.");
    }

    return container * parseFloat(relative.substring(0, relative.length - 1)) / 100;
};

/**
 * Converts a relative size schema to its absolute pixel equivalents.
 *
 * @param container   Containing area for the relative sizes.
 * @param requestedSize   User-friendly relative sizes.
 * @returns The absolute size schema equivalent for the sizes.
 */
export const getAbsoluteSizeInContainer = (container: IAbsoluteSizeSchema, requestedSize: IRelativeSizeSchema): IAbsoluteSizeSchema => ({
    height: convertRelativeToAbsoluteSize(container.height, requestedSize.height),
    width: convertRelativeToAbsoluteSize(container.width, requestedSize.width),
});

/**
 * Removes a vertical area from a container size.
 *
 * @param container   Containing area for the relative sizes.
 * @param height   Vertical amount to remove from the container.
 * @returns Remaining area in the container.
 */
export const getAbsoluteSizeRemaining = (container: IAbsoluteSizeSchema, height: number): IAbsoluteSizeSchema => ({
    height: container.height - height,
    width: container.width,
});
