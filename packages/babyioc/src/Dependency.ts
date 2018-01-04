import { getFunctionName } from "./Reading";

/**
 * Describes a dependency of a class.
 */
export interface IDependencyListing {
    /**
     * Class or function name of the dependency.
     */
    dependencyName: string;

    /**
     * Member property name the instance will be stored under.
     */
    memberName: string;
}

/**
 * Adds a dependency to a component class.
 *
 * @param componentFunction   Class or function creates the component, unique string name thereof.
 */
export const dependency = (dependencyName: string | Function): any => {
    if (typeof dependencyName === "function") {
        dependencyName = getFunctionName(dependencyName);
    }

    return (dependingClass: any, memberName: string) => {
        const listing = { dependencyName, memberName };

        if (dependingClass.__dependencies__) {
            dependingClass.__dependencies__.push(listing);
        } else {
            dependingClass.__dependencies__ = [listing];
        }
    };
};
