import { IClassNames } from "../Bootstrapping/ClassNames";
import { ICreateElement } from "../Bootstrapping/CreateElement";
import { IStyles } from "../Bootstrapping/Styles";
import { IMenuSchema } from "../Menus/MenuSchemas";
import { getAbsoluteSizeRemaining, IAbsoluteSizeSchema } from "../Sizing";

/**
 * Dependencies to initialize a new AreasFaker.
 */
export interface IAreasFakerDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: IClassNames;

    /**
     * Container that will contain the contents and menus.
     */
    container: HTMLElement;

    /**
     * Creates a new HTML element.
     */
    createElement: ICreateElement;

    /**
     * Menus to create inside of the container.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;
}

/**
 * Estimation for a menu area element and size.
 */
export interface IMenuAreaEstimation {
    /**
     * Fake menu area element.
     */
    menuArea: HTMLElement;

    /**
     * Estimated size of the menu area.
     */
    menuSize: IAbsoluteSizeSchema;
}

/**
 * Creates placeholder menu titles before a real menu is created.
 */
export class AreasFaker {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IAreasFakerDependencies;

    /**
     * Initializes a new instance of the AreasFaker class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IAreasFakerDependencies) {
        this.dependencies = dependencies;
    }

    /**
     * Creates and adds a realistically sized area for menu titles.
     *
     * @param containerSize   Maximum allowed size from the parent container.
     * @returns A Promise for the menu area and the remaining usable space within the container.
     */
    public async createAndAppendMenuArea(containerSize: IAbsoluteSizeSchema): Promise<IMenuAreaEstimation> {
        const menuArea = this.createAreaWithMenuTitles(containerSize);
        this.dependencies.container.appendChild(menuArea);

        // DOM elements need some alone time to compute their size
        await Promise.resolve();

        const clientRect = menuArea.getBoundingClientRect();
        const menuSize: IAbsoluteSizeSchema = {
            height: Math.round(clientRect.height),
            width: Math.round(clientRect.width)
        };

        return { menuArea, menuSize };
    }

    /**
     * Creates an area the expected available size for content.
     *
     * @param containerSize   Size of the parent container.
     * @param menuAreaSize   Size taken up by the menu.
     */
    public createContentArea(containerSize: IAbsoluteSizeSchema, menuAreaSize: IAbsoluteSizeSchema) {
        const contentSize = getAbsoluteSizeRemaining(containerSize, menuAreaSize.height);
        const contentArea = this.dependencies.createElement("div", {
            className: this.dependencies.classNames.contentArea,
            style: {
                ...this.dependencies.styles.contentArea,
                height: `${contentSize.height}px`,
                width: `${contentSize.width}px`,
            }
        });

        return { contentSize, contentArea };
    }

    /**
     * Creates an area with titles for each menu.
     *
     * @param containerSize   Maximum allowed size from the parent container.
     * @returns An area with titles for each menu.
     */
    private createAreaWithMenuTitles(containerSize: IAbsoluteSizeSchema): HTMLElement {
        const innerArea = this.dependencies.createElement("div", {
            className: [
                this.dependencies.classNames.menusInnerArea,
                this.dependencies.classNames.menusInnerAreaFake
            ].join(" "),
            style: {
                ...this.dependencies.styles.menusInnerArea,
                ...this.dependencies.styles.menusInnerAreaFake,
                width: `${containerSize.width}px`
            }
        });
        const outerArea = this.dependencies.createElement("div", {
            className: this.dependencies.classNames.menusOuterArea,
            children: [innerArea]
        });

        for (const menu of this.dependencies.menus) {
            innerArea.appendChild(
                this.dependencies.createElement("div", {
                    className: this.dependencies.classNames.menu,
                    children: [
                        this.dependencies.createElement("h4", {
                            className: this.dependencies.classNames.menuTitle,
                            style: this.dependencies.styles.menuTitle,
                            textContent: menu.title
                        })
                    ],
                    style: this.dependencies.styles.menu
                }));
        }

        return outerArea;
    }
}
