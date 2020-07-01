import { defaultClassNames } from "./Bootstrapping/ClassNames";
import { createElement } from "./Bootstrapping/CreateElement";
import { getAvailableContainerHeight } from "./Bootstrapping/GetAvailableContainerHeight";
import { defaultStyles } from "./Bootstrapping/Styles";
import { Display } from "./Display";
import {
    ICompleteUserWrapprSettings,
    IOptionalUserWrapprSettings,
    IRequireJs,
    IUserWrappr,
    IUserWrapprSettings,
} from "./IUserWrappr";
import { IInitializeMenusView, IInitializeMenusViewWrapper } from "./Menus/InitializeMenus";
import { IAbsoluteSizeSchema, IRelativeSizeSchema } from "./Sizing";

/**
 * Browser-only inclusion of requirejs.
 *
 * @see https://github.com/DefinitelyTyped/DefinitelyTyped/issues/21310.
 */
declare const requirejs: IRequireJs;

/**
 * View libraries required to initialize a wrapping display.
 */
const externalViewLibraries: string[] = ["react", "react-dom", "mobx", "mobx-react"];

/**
 * Getters for the defaults of each optional UserWrappr setting.
 */
type IOptionalUserWrapprSettingsDefaults = {
    [P in keyof IOptionalUserWrapprSettings]: () => IOptionalUserWrapprSettings[P];
};

/**
 * Getters for the defaults of each optional UserWrappr setting.
 *
 * @remarks This allows scripts to not attempt to access overriden globals like requirejs.
 */
const defaultSettings: IOptionalUserWrapprSettingsDefaults = {
    classNames: () => defaultClassNames,
    createElement: () => createElement,
    defaultSize: () => ({
        height: "100%",
        width: "100%",
    }),
    getAvailableContainerHeight: () => getAvailableContainerHeight,
    menuInitializer: () => "UserWrappr-Delayed",
    menus: () => [],
    requirejs: () => requirejs,
    styles: () => defaultStyles,
};

/**
 * Backs up an optional provided setting with its default.
 *
 * @param value   Provided partial setting, if it exists.
 * @param getDefault   Gets the default setting value.
 * @returns Complete filled-out setting value.
 */
const ensureOptionalSetting = <TSetting>(
    value: TSetting | undefined,
    getDefault: () => TSetting
): TSetting => (value === undefined ? getDefault() : value);

/**
 * Overrides a default setting with a provided partial setting one level deep.
 *
 * @param value   Provided partial setting, if it exists.
 * @param getDefault   Gets the default setting value.
 * @returns Complete filled-out setting value.
 */
const extendDefaultSetting = <TSetting extends object>(
    value: Partial<TSetting> | undefined,
    backup: () => TSetting
): TSetting => {
    if (value === undefined) {
        return backup();
    }

    return {
        ...(backup() as object),
        ...(value as object),
    } as TSetting;
};

/**
 * Overrides a default setting with a provided partial setting two levels deep.
 *
 * @param value   Provided partial setting, if it exists.
 * @param getDefault   Gets the default setting value.
 * @returns Complete filled-out setting value.
 */
const overrideDefaultSetting = <TSetting extends object>(
    value: Partial<TSetting> | undefined,
    backup: () => TSetting
): TSetting => {
    if (value === undefined) {
        return backup();
    }

    const output: Partial<TSetting> = backup();

    for (const key in value) {
        output[key] = {
            ...(output[key] as any),
            ...(value[key] as any),
        } as any;
    }

    return output as TSetting;
};

/**
 * Creates configurable HTML displays over flexible-sized contents.
 */
export class UserWrappr implements IUserWrappr {
    /**
     * Settings for the UserWrappr.
     */
    private readonly settings: ICompleteUserWrapprSettings;

    /**
     * Contains generated contents and menus, once instantiated.
     */
    private display: Display;

    /**
     * Pending view libraries loading.
     */
    private viewLibrariesLoading: Promise<IInitializeMenusView>;

    /**
     * Initializes a new instance of the UserWrappr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IUserWrapprSettings) {
        this.settings = {
            classNames: extendDefaultSetting(settings.classNames, defaultSettings.classNames),
            createContents: settings.createContents,
            createElement: ensureOptionalSetting(
                settings.createElement,
                defaultSettings.createElement
            ),
            defaultSize: ensureOptionalSetting(settings.defaultSize, defaultSettings.defaultSize),
            getAvailableContainerHeight: ensureOptionalSetting(
                settings.getAvailableContainerHeight,
                defaultSettings.getAvailableContainerHeight
            ),
            menuInitializer: ensureOptionalSetting(
                settings.menuInitializer,
                defaultSettings.menuInitializer
            ),
            menus: ensureOptionalSetting(settings.menus, defaultSettings.menus),
            requirejs: ensureOptionalSetting(settings.requirejs, defaultSettings.requirejs),
            styles: overrideDefaultSetting(settings.styles, defaultSettings.styles),
        };
    }

    /**
     * Initializes a new display and contents.
     *
     * @param container   Element to instantiate contents within.
     * @returns A Promise for having created contents and menus.
     */
    public async createDisplay(container: HTMLElement): Promise<void> {
        if (this.display !== undefined) {
            throw new Error("Cannot create multiple displays from a UserWrappr.");
        }

        this.viewLibrariesLoading = this.loadViewLibraries();

        this.display = new Display({
            classNames: this.settings.classNames,
            container,
            createContents: this.settings.createContents,
            createElement: this.settings.createElement,
            getAvailableContainerHeight: this.settings.getAvailableContainerHeight,
            menus: this.settings.menus,
            styles: this.settings.styles,
            userWrapper: this,
        });

        await this.resetSize(this.settings.defaultSize);
    }

    /**
     * Resets the internal contents to a new size, if created yet.
     *
     * @param size   New size of the contents.
     * @returns A Promise for whether the display was available to reset size.
     */
    public async resetSize(size: IRelativeSizeSchema): Promise<boolean> {
        if (this.viewLibrariesLoading === undefined) {
            throw new Error("A display must be created before resetting size.");
        }

        if (this.display === undefined) {
            return false;
        }

        const containerSize: IAbsoluteSizeSchema = await this.display.resetContents(size);
        const initializeMenusView: IInitializeMenusView = await this.viewLibrariesLoading;

        await initializeMenusView({
            classNames: this.settings.classNames,
            container: this.display.getContainer(),
            containerSize,
            menus: this.settings.menus,
            styles: this.settings.styles,
        });

        return true;
    }

    /**
     * Loads external view logic.
     *
     * @returns A Promise for a method to create a wrapping game view in a container.
     */
    private async loadViewLibraries(): Promise<IInitializeMenusView> {
        await this.require(externalViewLibraries);

        const wrapperModule: IInitializeMenusViewWrapper = await this.require<
            IInitializeMenusViewWrapper
        >([this.settings.menuInitializer]);

        return wrapperModule.initializeMenus;
    }

    /**
     * Loads external scripts.
     *
     * @param modules   Module identifiers of the scripts.
     * @returns Required contents of the scripts.
     */
    private async require<TResults>(modules: string[]): Promise<TResults> {
        return new Promise<TResults>((resolve, reject) => {
            this.settings.requirejs(modules, resolve, reject);
        });
    }
}
