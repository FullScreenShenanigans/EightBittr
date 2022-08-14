import { stubClassNames, stubStyles } from "../fakes.test";
import { AbsoluteSizeSchema } from "../Sizing";
import { AreasFaker, AreasFakerDependencies } from "./AreasFaker";
import { createElement } from "./CreateElement";

export const stubContainerSize: AbsoluteSizeSchema = {
    height: 280,
    width: 210,
};

const stubDependencies: AreasFakerDependencies = {
    classNames: stubClassNames,
    container: createElement("div", {
        style: {
            height: `${stubContainerSize.height}px`,
            width: `${stubContainerSize.width}px`,
        },
    }),
    createElement,
    menus: [],
    styles: stubStyles,
};

export const stubAreasFaker = (partialDependencies: Partial<AreasFakerDependencies> = {}) =>
    new AreasFaker({
        ...stubDependencies,
        ...partialDependencies,
    });
