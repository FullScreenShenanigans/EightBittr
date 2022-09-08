export type Direction = "bottom" | "left" | "right" | "top";

export type BoundingBox = Record<Direction, number>;

export type Axis = "height" | "width";

export type HeightAndWidth = Record<Axis, number>;

/**
 * How to align children within their container.
 *
 * @todo This should probably be separated into horizontal and vertical.
 */
export type Align = Direction | "stretch";
