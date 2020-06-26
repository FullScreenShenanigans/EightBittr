export type IClassWithArg<TContainer, TInstance> = new (arg: TContainer) => TInstance;

export type IClassWithoutArgs<TInstance> = new () => TInstance;

export type IMemberFunction<TContainer, TInstance> = (container: TContainer) => TInstance;

export type IMemberClass<TContainer, TInstance> =
    | IClassWithArg<TContainer, TInstance>
    | IClassWithoutArgs<TInstance>;

/**
 * Decorates a caching getter on a class prototype.
 *
 * @param factory   Method used once within the getter to create an instance member.
 */
export const factory = <TContainer extends {}, TInstance>(
    factory: IMemberFunction<TContainer, TInstance>
) => (parentPrototype: TContainer, memberName: string) => {
    Object.defineProperty(parentPrototype, memberName, {
        configurable: true,
        get(this: TContainer): TInstance {
            const value: TInstance = factory(this);

            Object.defineProperty(this, memberName, {
                configurable: false,
                get: () => value,
            });

            return value;
        },
    });
};

/**
 * Decorates a member member class on a class prototype.
 *
 * @param MemberClass   Class to be initialized for the member instance.
 */
export const member = <TContainer extends {}, TInstance>(
    MemberClass: IMemberClass<TContainer, TInstance>
) => factory((container: TContainer) => new MemberClass(container));
