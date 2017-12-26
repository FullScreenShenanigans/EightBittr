import { BrowserClock, createClock } from "lolex";
import { SinonSpy, spy } from "sinon";

import { IClassNames } from "./Bootstrapping/ClassNames";
import { createElement } from "./Bootstrapping/CreateElement";
import { IStyles } from "./Bootstrapping/Styles";
import { IOptionalUserWrapprSettings, IRequiredUserWrapprSettings, IRequireJs, IUserWrappr, IUserWrapprSettings } from "./IUserWrappr";
import { IAbsoluteSizeSchema } from "./Sizing";
import { UserWrappr } from "./UserWrappr";

export interface ITestUserWrapprSettings extends IOptionalUserWrapprSettings, IRequiredUserWrapprSettings {
    contents: Element;
    clock: BrowserClock;
    requirejs: SinonSpy;
}

export interface ITestUserWrappr extends ITestUserWrapprSettings {
    container: HTMLElement;
    userWrapper: IUserWrappr;
}

/**
 * Browser-only inclusion of requirejs.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21310.
 */
declare const requirejs: IRequireJs;

export const stubClassNames: IClassNames = {
    contentArea: "user-wrappr-stubs-content-area",
    menu: "user-wrappr-stubs-menu",
    menuChildren: "user-wrappr-stubs-menu-children",
    menusInnerArea: "user-wrappr-stubs-inner-area",
    menusInnerAreaFake: "user-wrappr-stubs-inner-area-fake",
    menusOuterArea: "user-wrappr-stubs-outer-area",
    menuTitle: "user-wrappr-stubs-menu-title",
    option: "user-wrappr-stubs-option",
    optionLeft: "user-wrappr-stubs-option-left",
    optionRight: "user-wrappr-stubs-option-right",
    options: "user-wrappr-stubs-options",
    optionsList: "user-wrappr-stubs-options-list",
};

export const stubStyles: IStyles = {
    contentArea: {
        textAlign: "right",
    },
    input: {
        textAlign: "right",
    },
    inputButton: {
        textAlign: "left",
    },
    inputButtonAction: {
        textAlign: "center",
    },
    inputButtonBoolean: {
        textAlign: "right",
    },
    inputButtonOff: {
        textAlign: "left",
    },
    inputButtonOn: {
        textAlign: "center",
    },
    inputSelect: {
        textAlign: "left",
    },
    menuChildrenOpen: {
        textAlign: "right",
    },
    menuChildrenClosed: {
        textAlign: "left",
    },
    menu: {
        textAlign: "center",
    },
    menusInnerArea: {
        textAlign: "left",
    },
    menusInnerAreaFake: {
        textAlign: "center",
    },
    menuTitle: {
        textAlign: "right",
    },
    option: {
        textAlign: "left",
    },
    optionLeft: {
        textAlign: "center",
    },
    optionRight: {
        textAlign: "right",
    },
    options: {
        textAlign: "left",
    },
    optionsList: {
        textAlign: "center",
    },
};

const stubUserWrapprSettings = (): ITestUserWrapprSettings => {
    const contents = document.createElement("canvas");
    const clock = createClock<BrowserClock>();

    return {
        classNames: stubClassNames,
        clock,
        contents,
        createContents: (size: IAbsoluteSizeSchema) => {
            contents.height = size.height;
            contents.width = size.width;
            return contents;
        },
        createElement,
        defaultSize: {
            height: 350,
            width: 490,
        },
        getAvailableContainerHeight: (): number => 700,
        menuInitializer: "../src/Menus/InitializeMenus",
        menus: [],
        styles: stubStyles,
        requirejs: spy(requirejs),
    };
};

export const stubUserWrappr = (settings: Partial<IUserWrapprSettings> = {}): ITestUserWrappr => {
    const fullSettings: ITestUserWrapprSettings = {
        ...stubUserWrapprSettings(),
        ...settings,
    } as ITestUserWrapprSettings;
    const container = document.createElement("div");
    const userWrapper: IUserWrappr = new UserWrappr(fullSettings);

    return { ...fullSettings, container, userWrapper };
};
