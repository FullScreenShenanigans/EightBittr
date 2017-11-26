import { createElement } from "../../../src/Bootstrapping/CreateElement";
import { IWrappingViewDependencies } from "../../../src/Menus/InitializeMenus";
import { stubClassNames, stubStyles } from "../../UserWrappr/stubs";

export const stubWrappingViewDependencies = (partialDependencies: Partial<IWrappingViewDependencies> = {}): IWrappingViewDependencies => {
    const classNames = partialDependencies.classNames === undefined
        ? stubClassNames
        : partialDependencies.classNames;

    return {
        classNames,
        container: createElement("div", {
            className: "stub-container",
            children: [
                createElement("div", {
                    children: [
                        createElement("div", {
                            className: [
                                classNames.menusInnerArea,
                                classNames.menusInnerAreaFake
                            ].join(" ")
                        })
                    ],
                    className: classNames.menusOuterArea,
                })
            ]
        }),
        containerSize: {
            height: 350,
            width: 420
        },
        menus: [],
        styles: stubStyles,
        ...partialDependencies
    };
};
