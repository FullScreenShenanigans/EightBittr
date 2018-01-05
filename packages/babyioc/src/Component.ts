import { getFunctionName } from "./Reading";

export interface IClassWithArg {
    new(arg: any): any;
}

export interface IClassWithoutArgs {
    new(): any;
}

export type IComponentClassOrFunction = IClassWithArg | IClassWithoutArgs | IComponentFunction;

export type IComponentFunction = (container: any) => any;

/**
 * Adds a member component to a parent container.
 *
 * @param componentFunction   Class or function that creates the component.
 * @param name   Name to store the component under, if not the class' or function's .name.
 */
export const component = (componentFunction: IComponentClassOrFunction, name?: string | Function) => {
    const functionName = name === undefined
        ? getFunctionName(componentFunction)
        : getFunctionName(name);

    return (parentPrototype: any, memberName: string) => {
        Object.defineProperty(parentPrototype, memberName, {
            configurable: true,
            get() {
                const value = new (componentFunction as IClassWithArg)(this);

                Object.defineProperty(this, memberName, {
                    configurable: true,
                    get: () => value,
                });

                return value;
            },
        });
    };
};
