import { useFakeTimers } from "sinon-timers-repeatable";

import { createElement } from "../Bootstrapping/CreateElement";
import { stubClassNames, stubStyles } from "../fakes.test";
import { WrappingViewDependencies } from "./InitializeMenus";
import { MenuStore, MenuStoreDependencies } from "./MenuStore";

export const stubMenuStore = (dependencies: Partial<MenuStoreDependencies> = {}) => {
    const clock = useFakeTimers();

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
    partialDependencies: Partial<WrappingViewDependencies> = {}
): WrappingViewDependencies => {
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
