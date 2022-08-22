import * as sinon from "sinon";
import { useFakeTimers } from "sinon-timers-repeatable";

import { ClassNames } from "./Bootstrapping/ClassNames";
import { createElement } from "./Bootstrapping/CreateElement";
import { Styles } from "./Bootstrapping/Styles";
import { AbsoluteSizeSchema } from "./Sizing";
import {
    OptionalUserWrapprSettings,
    RequiredUserWrapprSettings,
    RequireJs,
    UserWrapprSettings,
} from "./types";
import { UserWrappr } from "./UserWrappr";

export interface TestUserWrapprSettings
    extends OptionalUserWrapprSettings,
        RequiredUserWrapprSettings {
    contents: Element;
    clock: sinon.SinonFakeTimers;
    requirejs: sinon.SinonSpy;
}

export interface TestUserWrappr extends TestUserWrapprSettings {
    container: HTMLElement;
    userWrapper: UserWrappr;
}

/**
 * Browser-only inclusion of requirejs.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21310.
 */
declare const requirejs: RequireJs;

export const stubClassNames: ClassNames = {
    button: "user-wrappr-stubs-button",
    buttonRound: "user-wrappr-stubs-button-round",
    buttonsArea: "user-wrappr-stubs-buttons-area",
    buttonSquare: "user-wrappr-stubs-button-square",
    contentArea: "user-wrappr-stubs-content-area",
    menu: "user-wrappr-stubs-menu",
    menuChildren: "user-wrappr-stubs-menu-children",
    menuTitle: "user-wrappr-stubs-menu-title",
    menuTitleButton: "user-wrappr-stubs-menu-title-button",
    menuTitleButtonFake: "user-wrappr-stubs-menu-title-button-fake",
    menusInnerArea: "user-wrappr-stubs-inner-area",
    menusInnerAreaFake: "user-wrappr-stubs-inner-area-fake",
    menusOuterArea: "user-wrappr-stubs-outer-area",
    option: "user-wrappr-stubs-option",
    optionLeft: "user-wrappr-stubs-option-left",
    optionRight: "user-wrappr-stubs-option-right",
    options: "user-wrappr-stubs-options",
    optionsList: "user-wrappr-stubs-options-list",
};

export const stubStyles: Styles = {
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
    menu: {
        textAlign: "center",
    },
    menuChildrenClosed: {
        textAlign: "left",
    },
    menuChildrenOpen: {
        textAlign: "right",
    },
    menuTitle: {
        textAlign: "right",
    },
    menuTitleButton: {
        textAlign: "center",
    },
    menuTitleButtonFake: {
        textAlign: "center",
    },
    menusInnerArea: {
        textAlign: "left",
    },
    menusInnerAreaFake: {
        textAlign: "center",
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

const stubUserWrapprSettings = (): TestUserWrapprSettings => {
    const contents = document.createElement("canvas");
    const clock = useFakeTimers();

    return {
        buttons: [],
        classNames: stubClassNames,
        clock,
        contents,
        createContents: (size: AbsoluteSizeSchema) => {
            contents.height = size.height;
            contents.width = size.width;
            return contents;
        },
        createElement,
        defaultSize: {
            height: 350,
            width: 490,
        },
        gameWindow: {},
        getAvailableContainerHeight: () => 700,
        menuInitializer: "../lib/Delayed/UserWrappr-Delayed",
        menus: [],
        requirejs: sinon.spy(requirejs),
        styles: stubStyles,
    };
};

export const stubUserWrappr = (
    settings: Partial<Omit<UserWrapprSettings, "classNames" | "requirejs" | "styles">> = {}
): TestUserWrappr => {
    const { requirejs, ...stubSettings } = stubUserWrapprSettings();
    const fullSettings = {
        ...stubSettings,
        ...settings,
        requirejs,
    };
    const container = document.createElement("div");
    const userWrapper = new UserWrappr(fullSettings);

    return { ...fullSettings, container, userWrapper };
};
