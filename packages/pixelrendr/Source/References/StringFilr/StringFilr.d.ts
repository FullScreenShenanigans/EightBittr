declare module StringFilr {
    export interface IStringFilrSettings {
        // An Object containing data stored as children of sub-Objects.
        library: any;

        // A String to use as a default key to rescue on, if provided.
        normal?: string;

        // Whether it's ok for the library to have Objects that don't contain the
        // normal key (by default, false).
        requireNormalKey?: boolean;
    }

    export interface IStringFilr {
        getLibrary(): any;
        getNormal(): string;
        getCache(): any;
        getCached(key: string): any;
        clearCache(): void;
        clearCached(key: string): void;
        get(keyRaw: string): any;
    }
}