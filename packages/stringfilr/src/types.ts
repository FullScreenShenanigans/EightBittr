/**
 * The core stored library in a StringFilr, as a tree of data.
 */
export interface ILibrary<T> {
    [i: string]: T | ILibrary<T>;
}

/**
 * A cache of previously completed lookups.
 */
export interface ICache<T> {
    [i: string]: T | ILibrary<T>;
}

/**
 * Settings to initialize a new IStringFilr.
 *
 * @template T   Type of items being stored.
 */
export interface IStringFilrSettings<T> {
    /**
     * An Object containing data stored as children of sub-Objects.
     */
    library: ILibrary<T>;

    /**
     * A String to use as a default key to rescue on, if provided.
     */
    normal?: string;
}
