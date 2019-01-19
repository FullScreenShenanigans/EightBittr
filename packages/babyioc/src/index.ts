export type IClassWithArg<TContainer, TInstance> = new(arg: TContainer) => TInstance;

export type IClassWithoutArgs<TInstance> = new() => TInstance;

export type IComponentFunction<TContainer, TInstance> = (container: TContainer) => TInstance;

export type IComponentClassOrFunction<TContainer, TInstance> =
    | IClassWithArg<TContainer, TInstance>
    | IClassWithoutArgs<TInstance>
    | IComponentFunction<TContainer, TInstance>
;

/**
 * Adds a member component to a parent container.
 *
 * @param componentFunction   Class or function that creates the component.
 */
export const component = <TContainer extends {}, TInstance>(componentFunction: IComponentClassOrFunction<TContainer, TInstance>) =>
    (parentPrototype: TContainer, memberName: string) => {
        Object.defineProperty(parentPrototype, memberName, {
            configurable: true,
            get(this: TContainer): TInstance {
                const value: TInstance = new (componentFunction as IClassWithArg<TContainer, TInstance>)(this);

                Object.defineProperty(this, memberName, {
                    configurable: true,
                    get: () => value,
                });

                return value;
            },
        });
    };
