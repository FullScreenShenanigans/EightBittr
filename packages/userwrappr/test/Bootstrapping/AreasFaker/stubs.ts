import { AreasFaker, IAreasFakerDependencies } from "../../../src/Bootstrapping/AreasFaker";
import { createElement } from "../../../src/Bootstrapping/CreateElement";
import { IAbsoluteSizeSchema } from "../../../src/Sizing";
import { stubClassNames, stubStyles } from "../../UserWrappr/stubs";

export const stubContainerSize: IAbsoluteSizeSchema = {
    width: 210,
    height: 280
};

const stubDependencies: IAreasFakerDependencies = {
    classNames: stubClassNames,
    container: createElement("div", {
        style: {
            height: `${stubContainerSize.height}px`,
            width: `${stubContainerSize.width}px`
        }
    }),
    createElement,
    menus: [],
    styles: stubStyles
};

export const stubAreasFaker = (partialDependencies: Partial<IAreasFakerDependencies> = {}) =>
    new AreasFaker({
        ...stubDependencies,
        ...partialDependencies
    });
