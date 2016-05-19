declare module "IChangeLinr" {
    export interface ITransforms {
        [i: string]: ITransform;
    }
    export interface ITransform {
        (data: any, key?: string, attributes?: any, scope?: IChangeLinr): any;
    }
    export interface ICache {
        [i: string]: any;
    }
    export interface ICacheFull {
        [i: string]: {
            [j: string]: any;
        };
    }
    export interface IChangeLinrSettings {
        transforms: ITransforms;
        pipeline: string[];
        doMakeCache?: boolean;
        doUseCache?: boolean;
    }
    export interface IChangeLinr {
        getCache(): ICache;
        getCached(key: string): any;
        getCacheFull(): ICacheFull;
        getDoMakeCache(): boolean;
        getDoUseCache(): boolean;
        process(data: any, key?: string, attributes?: any): any;
        processFull(data: any, key: string, attributes?: any): any;
    }
}
declare module "ChangeLinr" {
    import { ICache, ICacheFull, IChangeLinr, IChangeLinrSettings } from "IChangeLinr";
    export class ChangeLinr implements IChangeLinr {
        private transforms;
        private pipeline;
        private cache;
        private cacheFull;
        private doMakeCache;
        private doUseCache;
        constructor(settings: IChangeLinrSettings);
        getCache(): ICache;
        getCached(key: string): any;
        getCacheFull(): ICacheFull;
        getDoMakeCache(): boolean;
        getDoUseCache(): boolean;
        process(data: any, key?: string, attributes?: any): any;
        processFull(data: any, key: string, attributes?: any): any;
    }
}
