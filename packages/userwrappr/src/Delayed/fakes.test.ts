import { createElement } from "../Bootstrapping/CreateElement";
import { stubClassNames, stubStyles } from "../fakes.test";
import { WrappingViewDependencies } from "./UserWrappr-Delayed";

export const stubWrappingViewDependencies = (
    partialDependencies: Partial<WrappingViewDependencies> = {}
): WrappingViewDependencies => {
    const classNames =
        partialDependencies.classNames === undefined
            ? stubClassNames
            : partialDependencies.classNames;

    return {
        buttons: [],
        classNames,
        container: createElement("div", {
            children: [
                createElement("div", {
                    children: [
                        createElement("div", {
                            className: [
                                classNames.menusInnerArea,
                                classNames.menusInnerAreaFake,
                            ].join(" "),
                        }),
                    ],
                    className: classNames.menusOuterArea,
                }),
            ],
            className: "stub-container",
        }),
        containerSize: {
            height: 350,
            width: 420,
        },
        gameWindow: {},
        menus: [],
        styles: stubStyles,
        ...partialDependencies,
    };
};
