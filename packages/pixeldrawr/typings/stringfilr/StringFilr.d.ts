declare module "IStringFilr" {
    export interface ILibrary<T> {
        [i: string]: T | ILibrary<T>;
    }
    export interface ICache<T> {
        [i: string]: T | ILibrary<T>;
    }
    export interface IStringFilrSettings<T> {
        library: ILibrary<T>;
        normal?: string;
        requireNormalKey?: boolean;
    }
    export interface IStringFilr<T> {
        getLibrary(): ILibrary<T>;
        getNormal(): string;
        getCache(): ICache<T>;
        getCached(key: string): T | ILibrary<T>;
        clearCache(): void;
        clearCached(key: string): void;
        get(keyRaw: string): T | ILibrary<T>;
    }
}
declare module "StringFilr" {
    import { ILibrary, ICache, IStringFilr, IStringFilrSettings } from "IStringFilr";
    export class StringFilr<T> implements IStringFilr<T> {
        private library;
        private cache;
        private normal;
        private requireNormalKey;
        constructor(settings: IStringFilrSettings<T>);
        getLibrary(): ILibrary<T>;
        getNormal(): string;
        getCache(): ICache<T>;
        getCached(key: string): any;
        clearCache(): void;
        clearCached(keyRaw: string): void;
        get(keyRaw: string): T | ILibrary<T>;
        private followClass(keys, current);
    }
}
