import { BrowserClock, createClock, LolexClock } from "lolex";

import { IClassNames } from "../Bootstrapping/ClassNames";
import { createElement } from "../Bootstrapping/CreateElement";
import { IStyles } from "../Bootstrapping/Styles";
import { stubClassNames, stubStyles } from "../fakes.test";
import { IWrappingViewDependencies } from "./InitializeMenus";
import { IMenuStoreDependencies, MenuStore } from "./MenuStore";

export const stubMenuStore = (dependencies: Partial<IMenuStoreDependencies> = {}) => {
    const clock: LolexClock<number> = createClock<BrowserClock>();
    const fullDependencies = {
        classNames: stubClassNames,
        styles: stubStyles,
        title: "abc",
        ...dependencies,
    };
    const store = new MenuStore(fullDependencies);

    return { ...fullDependencies, clock, store };
};

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
                                classNames.menusInnerAreaFake,
                            ].join(" "),
                        }),
                    ],
                    className: classNames.menusOuterArea,
                }),
            ],
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
