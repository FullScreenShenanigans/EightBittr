declare module StringFilr {
    /**
     * The core stored library in a StringFilr, as a tree of data.
     */
    export interface ILibrary {
        [i: string]: ILibrary | any;
    }

    /**
     * A cache of previously completed lookups.
     */
    export interface ICache {
        [i: string]: any;
    }

    /**
     * Settings to initialize a new IStringFilr.
     */
    export interface IStringFilrSettings {
        /**
         * An Object containing data stored as children of sub-Objects.
         */
        library: ILibrary;

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
     * A general utility for retrieving data from an Object based on nested class
     * names. Class names may be given in any order ro retrieve nested data. 
     */
    export interface IStringFilr {
        /**
         * @returns The base library of stored information.
         */
        getLibrary(): ILibrary;

        /**
         * @returns The optional normal class String.
         */
        getNormal(): string;

        /**
         * @returns The complete cache of previously completed lookups.
         */
        getCache(): any;

        /**
         * @returns A cached value, if it exists.
         */
        getCached(key: string): any;

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
        get(keyRaw: string): any;
    }
}
