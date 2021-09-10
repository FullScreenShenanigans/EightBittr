import { AreasFaker } from "./Bootstrapping/AreasFaker";
import { ClassNames } from "./Bootstrapping/ClassNames";
import { CreateElement } from "./Bootstrapping/CreateElement";
import { GetAvailableContainerHeight } from "./Bootstrapping/GetAvailableContainerHeight";
import { Styles } from "./Bootstrapping/Styles";
import { UserWrappr } from "./UserWrappr";
import { MenuSchema } from "./Menus/MenuSchemas";
import { getAbsoluteSizeInContainer, AbsoluteSizeSchema, RelativeSizeSchema } from "./Sizing";

/**
 * Creates contents for a size.
 *
 * @param size   Bounding size to create contents in.
 * @param userWrapper   Containing UserWrappr holding this display.
 * @returns Contents at the size.
 */
export type CreateContents = (size: AbsoluteSizeSchema, userWrapper: UserWrappr) => Element;

/**
 * Menu and content elements, once creatd.
 */
interface CreatedElements {
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
export interface DisplayDependencies {
    /**
     * Class names to use for display elements.
     */
    classNames: ClassNames;

    /**
     * Container that will contain the contents and menus.
     */
    container: HTMLElement;

    /**
     * Creates a new HTML element.
     */
    createElement: CreateElement;

    /**
     * Creates contents within a container.
     */
    createContents: CreateContents;

    /**
     * Gets how much height is available to size a container.
     */
    getAvailableContainerHeight: GetAvailableContainerHeight;

    /**
     * Menus to create inside of the view.
     */
    menus: MenuSchema[];

    /**
     * Styles to use for display elements.
     */
    styles: Styles;

    /**
     * Containing UserWrappr holding this display.
     */
    userWrapper: UserWrappr;
}

/**
 * Contains contents and menus within a container.
 */
export class Display {
    /**
     * Dependencies used for initialization.
     */
    private readonly dependencies: DisplayDependencies;

    /**
     * Creates placeholder menu titles before a real menu is created.
     */
    private readonly areasFaker: AreasFaker;

    /**
     * Menu and content elements, once created.
     */
    private createdElements: CreatedElements | undefined;

    /**
     * Initializes a new instance of the Display class.
     *
     * @param dependencies   Dependencies to be used for initialization.
     */
    public constructor(dependencies: DisplayDependencies) {
        this.dependencies = dependencies;
        this.areasFaker = new AreasFaker(this.dependencies);
    }

    /**
     * Creates initial contents and fake menus.
     *
     * @param requestedSize   Size of the contents.
     * @returns A Promise for the actual size of the contents.
     */
    public async resetContents(requestedSize: RelativeSizeSchema): Promise<AbsoluteSizeSchema> {
        if (this.createdElements !== undefined) {
            this.dependencies.container.removeChild(this.createdElements.contentArea);
            this.dependencies.container.removeChild(this.createdElements.menuArea);
        }

        const availableContainerSize = this.getAvailableContainerSize(
            this.dependencies.container
        );
        const containerSize = getAbsoluteSizeInContainer(availableContainerSize, requestedSize);
        const { menuArea, menuSize } = await this.areasFaker.createAndAppendMenuArea(
            containerSize
        );
        const { contentSize, contentArea } = this.areasFaker.createContentArea(
            containerSize,
            menuSize
        );

        this.dependencies.container.insertBefore(contentArea, menuArea);
        contentArea.appendChild(
            this.dependencies.createContents(contentSize, this.dependencies.userWrapper)
        );

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
    private getAvailableContainerSize(container: HTMLElement): AbsoluteSizeSchema {
        const availableHeight = this.dependencies.getAvailableContainerHeight();

        return {
            height: availableHeight - Math.round(container.offsetTop),
            width: Math.round(container.clientWidth),
        };
    }
}
