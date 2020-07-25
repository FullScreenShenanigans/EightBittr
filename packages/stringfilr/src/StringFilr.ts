import { Cache, Library, StringFilrSettings } from "./types";

/**
 * Path-based cache for quick loops in nested data structures.
 *
 * @template T   Type of items being stored.
 */
export class StringFilr<T> {
    /**
     * Recursive library of data.
     */
    private readonly library: Library<T>;

    /**
     * Optional default index to check when no suitable option is found.
     */
    private readonly normal?: string;

    /**
     * Previously completed lookups.
     */
    private cache: Cache<T>;

    /**
     * Initializes a new instance of the StringFilr class.
     *
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: StringFilrSettings<T>) {
        this.library = settings.library;
        this.normal = settings.normal;

        this.cache = {};
    }

    /**
     * @returns The base library of stored information.
     */
    public getLibrary(): Library<T> {
        return this.library;
    }

    /**
     * @returns The optional normal class String.
     */
    public getNormal(): string | undefined {
        return this.normal;
    }

    /**
     * @returns The complete cache of previously completed lookups.
     */
    public getCache(): Cache<T> {
        return this.cache;
    }

    /**
     * @returns A cached value, if it exists.
     */
    public getCached(key: string): T | Library<T> {
        return this.cache[key];
    }

    /**
     * Completely clears the lookup cache.
     */
    public clearCache(): void {
        this.cache = {};
    }

    /**
     * Clears the cached entry for a key.
     *
     * @param keyRaw   The raw key whose lookup is to be cleared.
     */
    public clearCached(keyRaw: string): void {
        delete this.cache[keyRaw];

        if (this.normal) {
            delete this.cache[keyRaw.replace(this.normal, "")];
        }
    }

    /**
     * Retrieves the deepest matching data in the library for a key.
     *
     * @param keyRaw   The raw key for data to look up, in String form.
     * @returns The deepest matching data in the library.
     */
    public get(keyRaw: string): T | Library<T> {
        if ({}.hasOwnProperty.call(this.cache, keyRaw)) {
            return this.cache[keyRaw];
        }

        const key = this.normal ? keyRaw.replace(this.normal, "") : keyRaw;

        if ({}.hasOwnProperty.call(this.cache, key)) {
            return this.cache[key];
        }

        const result: T | Library<T> = this.followClass(key.split(/\s+/g), this.library);

        this.cache[key] = this.cache[keyRaw] = result;
        return result;
    }

    /**
     * Utility Function to follow a path into the library (this is the driver
     * for searching into the library). For each available key, if it matches
     * a key in current, it is removed from keys and recursion happens on the
     * sub-directory in current.
     *
     * @param keys   The currently available keys to search within.
     * @param current   The current location being searched within the library.
     * @returns The most deeply matched part of the library.
     */
    private followClass(keys: string[], current: T | Library<T>): T | Library<T> {
        if (!keys || !keys.length) {
            return current;
        }

        for (let i = 0; i < keys.length; i += 1) {
            const key: string = keys[i];

            if ({}.hasOwnProperty.call(current, key)) {
                keys.splice(i, 1);
                return this.followClass(keys, (current as Library<T>)[key]);
            }
        }

        if (this.normal && {}.hasOwnProperty.call(current, this.normal)) {
            return this.followClass(keys, (current as Library<T>)[this.normal]);
        }

        return current;
    }
}
