import { IClassWithArgs, IComponentListing } from "./Component";

/**
 * Creates a getter method for a lazily computed instance.
 *
 * @param resolve   Resolves the value of the instance.
 * @returns A getter method for a lazilyi computed instance.
 */
const createLazyInstance = <TInstance>(resolve: () => any) => {
    let instance: TInstance | undefined;

    return () => {
        if (instance === undefined) {
            instance = resolve();
        }

        return instance;
    };
};

/**
 * Resolves the value of a lazily instantiated component.
 *
 * @param parentContainerInstance   Parent container creating this component.
 *
 */
const resolveComponent = (parentContainerInstance: any, listing: IComponentListing): any => {
    const { componentFunction } = listing;
    const componentInstance = new (componentFunction as IClassWithArgs)(parentContainerInstance);

    const dependencies = componentFunction.prototype.__dependencies__;
    if (dependencies !== undefined) {
        for (const dependency of dependencies) {
            Object.defineProperty(componentInstance, dependency.memberName, {
                configurable: true,
                get: createLazyInstance(() =>
                    parentContainerInstance[parentContainerInstance.__listings__[dependency.dependencyName].memberName]),
            });
        }
    }

    return componentInstance;
};

/**
 * Creates a class that creates getters to resolve its components.
 */
export const container = (containerClass: { new(...args: any[]): any }): any => {
    const createdComponents: any = {};

    return class extends containerClass {
        public constructor(...args: any[]) {
            super(...args);

            const listings = containerClass.prototype.__listings__;
            for (const listingName in listings) {
                if (!{}.hasOwnProperty.call(listings, listingName)) {
                    continue;
                }

                const listing = listings[listingName];

                Object.defineProperty(this, listing.memberName, {
                    configurable: true,
                    get: createLazyInstance(() => resolveComponent(this, listing)),
                });
            }
        }
    };
};
