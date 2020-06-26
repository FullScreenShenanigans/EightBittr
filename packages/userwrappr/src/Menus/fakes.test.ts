import { createClock } from "@sinonjs/fake-timers";

import { createElement } from "../Bootstrapping/CreateElement";
import { stubClassNames, stubStyles } from "../fakes.test";

import { IWrappingViewDependencies } from "./InitializeMenus";
import { IMenuStoreDependencies, MenuStore } from "./MenuStore";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock = createClock();
    const fullDependencies = {
        classNames: stubClassNames,
        styles: stubStyles,
        title: "abc",
        ...dependencies,
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};

export const stubWrappingViewDependencies = (
    partialDependencies: Partial<IWrappingViewDependencies> = {}
): IWrappingViewDependencies => {
    const classNames =
        partialDependencies.classNames === undefined
            ? stubClassNames
            : partialDependencies.classNames;

    return {
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
        menus: [],
        styles: stubStyles,
        ...partialDependencies,
    };
};
