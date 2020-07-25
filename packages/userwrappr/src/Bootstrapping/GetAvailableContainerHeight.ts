/**
 * Gets how much height is available to hold contents.
 *
 * @param container   Container element.
 * @returns How much height is available to hold contents.
 */
export type GetAvailableContainerHeight = () => number;

/**
 * Gets how much height is available to size a container.
 *
 * @param container   Container element.
 * @returns How much height is available to hold contents.
 */
export const getAvailableContainerHeight = (): number => window.innerHeight;
