import { getFunctionName } from "./Reading";

export type IContainerClass = IClass & {
    __listings__?: { [i: string]: IComponentListing };
};

export type IClass = IClassWithArgs | IClassWithoutArgs;

export interface IClassWithArgs {
    new(...args: any[]): any;
}

export interface IClassWithoutArgs {
    new(): any;
}

export type IComponentClassOrFunction = IComponentClass | IComponentFunction;

export interface IComponentClass {
    new(container: IClass): any;
}

export type IComponentFunction = (container: IClass) => any;

/**
 * Describes how to create and store a component.
 */
export interface IComponentListing {
    /**
     * Class or function to create the component.
     */
    componentFunction: IComponentClassOrFunction;

    /**
     * Unique name for the class or function to create this component.
     */
    listingName: string;

    /**
     * Member property name the component will be stored under.
     */
    memberName: string;
}

/**
 * Adds a member component to a parent container.
 *
 * @param componentFunction   Class or function that creates the component.
 * @param name   Name to store the component under, if not the class' or function's .name.
 */
export const component = (componentFunction: any /* IComponentClassOrFunction */, name?: string | Function) => {
    if (typeof name === "function") {
        name = getFunctionName(name);
    }

    const listingName = name === undefined
        ? getFunctionName(componentFunction)
        : name;

    return (parentClass: any /* IContainerClass */, memberName: string) => {
        const listing: IComponentListing = { componentFunction, listingName, memberName };

        if (parentClass.__listings__ === undefined) {
            parentClass.__listings__ = {};
        }

        parentClass.__listings__[listing.listingName] = listing;
    };
};
