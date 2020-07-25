/**
 * Resolved numeric rectangular size.
 */
export interface AbsoluteSizeSchema {
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
export type RelativeSize = number | string;

/**
 * User-friendly rectangular size.
 */
export interface RelativeSizeSchema {
    /**
     * Height of the rectangle.
     */
    height: RelativeSize;

    /**
     * Width of the rectangle.
     */
    width: RelativeSize;
}

/**
 * Converts a relative size to its absolute pixel number.
 *
 * @param container   Containing area for the relative size.
 * @param relative   User-friendly relative size.
 * @returns The absolute pixel number equivalent for the size.
 */
const convertRelativeToAbsoluteSize = (container: number, relative: RelativeSize): number => {
    if (typeof relative === "number") {
        return relative;
    }

    if (!/^(\d+)%$/.test(relative)) {
        throw new Error("Relative size should be in percentage form.");
    }

    return (container * parseFloat(relative.substring(0, relative.length - 1))) / 100;
};

/**
 * Converts a relative size schema to its absolute pixel equivalents.
 *
 * @param container   Containing area for the relative sizes.
 * @param requestedSize   User-friendly relative sizes.
 * @returns The absolute size schema equivalent for the sizes.
 */
export const getAbsoluteSizeInContainer = (
    container: AbsoluteSizeSchema,
    requestedSize: RelativeSizeSchema
): AbsoluteSizeSchema => ({
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
export const getAbsoluteSizeRemaining = (
    container: AbsoluteSizeSchema,
    height: number
): AbsoluteSizeSchema => ({
    height: container.height - height,
    width: container.width,
});
