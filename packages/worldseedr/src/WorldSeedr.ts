import { directionOpposites } from "./constants";
import { RandomChooser } from "./RandomChooser";
import { SpacingCalculator } from "./SpacingCalculator";
import {
    Align,
    BoundingBox,
    Direction,
    HeightAndWidth,
    PossibilitiesContainer,
    PossibilityChild,
    Result,
    Spacing,
    WorldSeedrSettings,
} from "./types";

/**
 * Schema-driven pseudorandom recursive generation of possibilities.
 */
export class WorldSeedr {
    /**
     * Possibilities that may be placed, keyed by title.
     */
    private readonly possibilities: PossibilitiesContainer;

    /**
     * Selects choices from arrays using a random number generator.
     */
    private readonly randomChooser: RandomChooser;

    /**
     * Generates spacing distances based on possibility schemas.
     */
    private readonly spacingCalculator: SpacingCalculator;

    /**
     * Initializes a new instance of the WorldSeedr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: WorldSeedrSettings) {
        const random = settings.random ?? (() => Math.random());

        this.possibilities = settings.possibilities;
        this.randomChooser = new RandomChooser(random);
        this.spacingCalculator = new SpacingCalculator(this.randomChooser);
    }

    public generate(name: string, box: BoundingBox) {
        console.log("Generating", name, "in", box);
        const results: Result[] = [];
        const possibility = this.randomChooser.chooseFixedOrRandom(this.possibilities[name]);
        const align = this.randomChooser.chooseFixedOrRandomOr(possibility.align, "stretch");
        const direction = this.randomChooser.chooseFixedOrRandom(possibility.direction);
        const repeat = this.randomChooser.chooseFixedOrRandomOr(possibility.repeat, 1);
        const size = this.randomChooser.chooseFixedOrRandom(possibility.size);
        const spacing = this.randomChooser.chooseFixedOrRandomOr(possibility.spacing, 0);

        let position: number | undefined = box[directionOpposites[direction]];

        for (let i = 0; i < repeat; i += 1) {
            const children = this.randomChooser.chooseFixedOrRandom(possibility.children);

            for (const child of Array.isArray(children) ? children : [children]) {
                position = this.generateChild(
                    box,
                    child,
                    direction,
                    this.randomChooser.chooseFixedOrRandomOr(child.align, align),
                    position,
                    size,
                    spacing,
                    results
                );

                if (position === undefined) {
                    return results;
                }
            }
        }

        return results;
    }

    private generateChild(
        box: BoundingBox,
        childrenPossible: PossibilityChild,
        direction: Direction,
        align: Align,
        position: number,
        size: HeightAndWidth,
        spacing: Spacing,
        results: Result[]
    ) {
        const child = this.randomChooser.chooseFixedOrRandom(childrenPossible);
        const sizeChild = this.randomChooser.chooseFixedOrRandomOr(child.size, size);
        const nextPosition = this.getNextPosition(direction, position, sizeChild, spacing);

        if (isPositionOutOfBounds(box, direction, nextPosition)) {
            return undefined;
        }

        const area = getNextArea(box, direction, align, nextPosition, position, sizeChild);

        if (child.type === "Possibility") {
            const title = this.randomChooser.chooseFixedOrRandom(child.title);
            results.push(...this.generate(title, area));
        } else {
            const properties = this.randomChooser.chooseFixedOrRandom(child.properties);
            const title = this.randomChooser.chooseFixedOrRandom(child.title);
            results.push({
                area,
                title,
                ...(properties ? { properties } : {}),
            });
        }

        return nextPosition;
    }

    private getNextPosition(
        direction: Direction,
        position: number,
        sizeChild: HeightAndWidth,
        spacing: Spacing
    ) {
        switch (direction) {
            case "bottom":
                return position - this.spacingCalculator.calculate(spacing) - sizeChild.height;
            case "left":
                return position - this.spacingCalculator.calculate(spacing) - sizeChild.width;
            case "right":
                return position + this.spacingCalculator.calculate(spacing) + sizeChild.width;
            case "top":
                return position + this.spacingCalculator.calculate(spacing) + sizeChild.height;
        }
    }
}

function getNextArea(
    box: BoundingBox,
    direction: Direction,
    align: Align,
    nextPosition: number,
    position: number,
    sizeChild: HeightAndWidth
) {
    switch (direction) {
        case "bottom":
            return {
                bottom: nextPosition,
                top: position,
                ...(align === "left"
                    ? {
                          left: box.left,
                          right: box.left + sizeChild.width,
                      }
                    : align === "right"
                    ? {
                          left: box.right - sizeChild.width,
                          right: box.right,
                      }
                    : {
                          left: box.left,
                          right: box.right,
                      }),
            };

        case "left":
            return {
                left: nextPosition,
                right: position,
                ...(align === "bottom"
                    ? {
                          bottom: box.bottom,
                          top: box.bottom + sizeChild.height,
                      }
                    : align === "top"
                    ? {
                          bottom: box.top - sizeChild.height,
                          top: box.top,
                      }
                    : {
                          bottom: box.bottom,
                          top: box.top,
                      }),
            };

        case "right":
            return {
                left: position,
                right: nextPosition,
                ...(align === "bottom"
                    ? {
                          bottom: box.bottom,
                          top: box.bottom + sizeChild.height,
                      }
                    : align === "top"
                    ? {
                          bottom: box.top - sizeChild.height,
                          top: box.top,
                      }
                    : {
                          bottom: box.bottom,
                          top: box.top,
                      }),
            };

        case "top":
            return {
                bottom: position,
                top: nextPosition,
                ...(align === "left"
                    ? {
                          left: box.left,
                          right: box.left + sizeChild.width,
                      }
                    : align === "right"
                    ? {
                          left: box.right - sizeChild.width,
                          right: box.right,
                      }
                    : {
                          left: box.left,
                          right: box.right,
                      }),
            };
    }
}

function isPositionOutOfBounds(box: BoundingBox, direction: Direction, position: number) {
    switch (direction) {
        case "bottom":
            return position < box.bottom;
        case "left":
            return position < box.left;
        case "right":
            return position > box.right;
        case "top":
            return position > box.top;
    }
}
