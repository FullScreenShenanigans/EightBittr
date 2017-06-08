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

    /**
     * Whether the library is required to contain the normal key in every
     * descendent (by default, false).
     */
    requireNormalKey?: boolean;
}

/**
 * A path-based cache for quick loops in nested data structures.
 */
export interface IStringFilr<T> {
    /**
     * @returns The base library of stored information.
     */
    getLibrary(): ILibrary<T>;

    /**
     * @returns The optional normal class String.
     */
    getNormal(): string | undefined;

    /**
     * @returns The complete cache of previously completed lookups.
     */
    getCache(): ICache<T>;

    /**
     * @returns A cached value, if it exists.
     */
    getCached(key: string): T | ILibrary<T>;

    /**
     * Completely clears the lookup cache.
     */
    clearCache(): void;

    /**
     * Clears the cached entry for a key.
     *
     * @param keyRaw   The raw key whose lookup is to be cleared.
     */
    clearCached(key: string): void;

    /**
     * Retrieves the deepest matching data in the library for a key.
     *
     * @param keyRaw   The raw key for data to look up, in String form.
     * @returns The deepest matching data in the library.
     */
    get(keyRaw: string): T | ILibrary<T>;
}
