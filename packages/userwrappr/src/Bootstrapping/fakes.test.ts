import { stubClassNames, stubStyles } from "../fakes.test";
import { IAbsoluteSizeSchema } from "../Sizing";
import { AreasFaker, IAreasFakerDependencies } from "./AreasFaker";
import { createElement } from "./CreateElement";

export const stubContainerSize: IAbsoluteSizeSchema = {
    width: 210,
    height: 280,
};

const stubDependencies: IAreasFakerDependencies = {
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

export const stubAreasFaker = (partialDependencies: Partial<IAreasFakerDependencies> = {}) =>
    new AreasFaker({
        ...stubDependencies,
        ...partialDependencies,
    });
