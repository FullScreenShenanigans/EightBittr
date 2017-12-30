import { AreasFaker } from "./Bootstrapping/AreasFaker";
import { IClassNames } from "./Bootstrapping/ClassNames";
import { ICreateElement } from "./Bootstrapping/CreateElement";
import { IGetAvailableContainerHeight } from "./Bootstrapping/GetAvailableContainerHeight";
import { IStyles } from "./Bootstrapping/Styles";
import { IUserWrappr } from "./IUserWrappr";
import { IMenuSchema } from "./Menus/MenuSchemas";
import { getAbsoluteSizeInContainer, IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

/**
 * Creates contents for a size.
 *
 * @param size   Bounding size to create contents in.
 * @param userWrapper   Containing IUserWrappr holding this display.
 * @returns Contents at the size.
 */
export type ICreateContents = (size: IAbsoluteSizeSchema, userWrapper: IUserWrappr) => Element;

/**
 * Menu and content elements, once creatd.
 */
interface ICreatedElements {
    /**
     * Contains the created contents.
     */
    contentArea: HTMLElement;

    /**
     * Contains the real or fake menu elements.
     */
    menuArea: HTMLElement;
}

/**
 * Dependencies to initialize a new Display.
 */
export interface IDisplayDependencies {
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
     * Creates contents within a container.
     */
    createContents: ICreateContents;

    /**
     * Gets how much height is available to size a container.
     */
    getAvailableContainerHeight: IGetAvailableContainerHeight;

    /**
     * Menus to create inside of the view.
     */
    menus: IMenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: IStyles;

    /**
     * Containing IUserWrappr holding this display.
     */
    userWrapper: IUserWrappr;
}

/**
 * Contains contents and menus within a container.
 */
export class Display {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: IDisplayDependencies;

    /**
     * Creates placeholder menu titles before a real menu is created.
     */
    private readonly areasFaker: AreasFaker;

    /**
     * Menu and content elements, once created.
     */
    private createdElements: ICreatedElements | undefined;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: IDisplayDependencies) {
        this.dependencies = dependencies;
        this.areasFaker = new AreasFaker(this.dependencies);
    }

    /**
     * Creates initial contents and fake menus.
     *
     * @param requestedSize   Size of the contents.
     * @returns A Promise for the actual size of the contents.
     */
    public async resetContents(requestedSize: IRelativeSizeSchema): Promise<IAbsoluteSizeSchema> {
        if (this.createdElements !== undefined) {
            this.dependencies.container.removeChild(this.createdElements.contentArea);
            this.dependencies.container.removeChild(this.createdElements.menuArea);
        }

        const availableContainerSize: IAbsoluteSizeSchema = this.getAvailableContainerSize(this.dependencies.container);
        const containerSize: IAbsoluteSizeSchema = getAbsoluteSizeInContainer(availableContainerSize, requestedSize);
        const { menuArea, menuSize } = await this.areasFaker.createAndAppendMenuArea(containerSize);
        const { contentSize, contentArea } = this.areasFaker.createContentArea(containerSize, menuSize);

        this.dependencies.container.insertBefore(contentArea, menuArea);
        contentArea.appendChild(this.dependencies.createContents(contentSize, this.dependencies.userWrapper));

        this.createdElements = { contentArea, menuArea };

        return containerSize;
    }

    /**
     * @returns The container holding the contents and menus.
     */
    public getContainer(): HTMLElement {
        return this.dependencies.container;
    }

    /**
     * Gets how much space is available to size a container.
     *
     * @param container   Container element.
     * @returns How much space is available to size the container.
     */
    private getAvailableContainerSize(container: HTMLElement): IAbsoluteSizeSchema {
        const availableHeight = this.dependencies.getAvailableContainerHeight();

        return {
            height: availableHeight - Math.round(container.offsetTop),
            width: Math.round(container.clientWidth),
        };
    }
}
