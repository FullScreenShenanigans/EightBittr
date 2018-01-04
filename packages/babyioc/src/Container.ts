import { IClassWithArgs } from "./Component";

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
 * Creates a class that creates getters to resolve its components.
 */
export const container = (containerClass: { new(...args: any[]): any }): any =>
    class extends containerClass {
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
                    get: createLazyInstance(() => new (listing.componentFunction as IClassWithArgs)(this)),
                });
            }
        }
    };
