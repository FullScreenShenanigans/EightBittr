/**
 * The core stored library in a StringFilr, as a tree of data.
 */
export interface Library<T> {
    [i: string]: T | Library<T>;
}

/**
 * A cache of previously completed lookups.
 */
export interface Cache<T> {
    [i: string]: T | Library<T>;
}

/**
 * Settings to initialize a new IStringFilr.
 *
 * @template T   Type of items being stored.
 */
export interface StringFilrSettings<T> {
    /**
     * An Object containing data stored as children of sub-Objects.
     */
    library: Library<T>;

    /**
     * A String to use as a default key to rescue on, if provided.
     */
    normal?: string;
}
