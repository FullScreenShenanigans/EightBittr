/**
 * The core stored library in a StringFilr, as a tree of data.
 */
// https://github.com/typescript-eslint/typescript-eslint/issues/5472
// eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
export interface Library<T> {
    [i: string]: T | Library<T>;
}

/**
 * A cache of previously completed lookups.
 */
export type Cache<T> = Record<string, T | Library<T>>;

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
