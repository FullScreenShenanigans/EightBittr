export type ClassWithArg<TContainer, TInstance> = new (arg: TContainer) => TInstance;

export type ClassWithoutArgs<TInstance> = new () => TInstance;

export type MemberFunction<TContainer, TInstance> = (container: TContainer) => TInstance;

export type MemberClass<TContainer, TInstance> =
    | ClassWithArg<TContainer, TInstance>
    | ClassWithoutArgs<TInstance>;

/**
 * Decorates a caching getter on a class prototype.
 *
 * @param factory   Method used once within the getter to create an instance member.
 */
export const factory =
    <TContainer extends {}, TInstance>(factory: MemberFunction<TContainer, TInstance>) =>
    (parentPrototype: TContainer, memberName: string) => {
        Object.defineProperty(parentPrototype, memberName, {
            configurable: true,
            get(this: TContainer): TInstance {
                const value: TInstance = factory(this);

                Object.defineProperty(this, memberName, {
                    configurable: false,
                    value,
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
    MemberClass: MemberClass<TContainer, TInstance>
) => factory((container: TContainer) => new MemberClass(container));
