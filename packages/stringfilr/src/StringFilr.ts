import {
    ICache, ILibrary, IStringFilr, IStringFilrSettings
} from "./IStringFilr";

/**
 * A path-based cache for quick loops in nested data structures.
 */
export class StringFilr<T> implements IStringFilr<T> {
    /**
     * The library of data.
     */
    private library: ILibrary<T>;

    /**
     * A cache of previously completed lookups.
     */
    private cache: ICache<T | ILibrary<T>>;

    /**
     * Optional default index to check when no suitable option is found.
     */
    private normal?: string;

    /**
     * Whether to crash when a sub-object in reset has no normal child.
     */
    private requireNormalKey: boolean;

    /**
     * Initializes a new instance of the StringFilr class.
     * 
     * @param settings   Settings to be used for initialization.
     */
    public constructor(settings: IStringFilrSettings<T>) {
        if (!settings) {
            throw new Error("No settings given to StringFilr.");
        }
        if (!settings.library) {
            throw new Error("No library given to StringFilr.");
        }

        this.library = settings.library;
        this.normal = settings.normal;
        this.requireNormalKey = !!settings.requireNormalKey;

        this.cache = {};
    }

    /**
     * @returns The base library of stored information.
     */
    public getLibrary(): ILibrary<T> {
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
    public getCache(): ICache<T> {
        return this.cache;
    }

    /**
     * @returns A cached value, if it exists.
     */
    public getCached(key: string): any {
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
    public get(keyRaw: string): T | ILibrary<T> {
        let key: string;

        if (this.cache.hasOwnProperty(keyRaw)) {
            return this.cache[keyRaw];
        }

        if (this.normal) {
            key = keyRaw.replace(this.normal, "");
        } else {
            key = keyRaw;
        }

        if (this.cache.hasOwnProperty(key)) {
            return this.cache[key];
        }

        const result: T | ILibrary<T> = this.followClass(key.split(/\s+/g), this.library);

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
    private followClass(keys: string[], current: any): T | ILibrary<T> {
        if (!keys || !keys.length) {
            return current;
        }

        for (let i: number = 0; i < keys.length; i += 1) {
            const key: string = keys[i];

            if (current.hasOwnProperty(key)) {
                keys.splice(i, 1);
                return this.followClass(keys, current[key]);
            }
        }

        if (this.normal && current.hasOwnProperty(this.normal)) {
            return this.followClass(keys, current[this.normal]);
        }

        return current;
    }
}
