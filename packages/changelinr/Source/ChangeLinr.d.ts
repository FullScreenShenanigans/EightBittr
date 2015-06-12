declare module ChangeLinr {
    export interface IChangeLinrTransform {
        (data: any, key: string, attributes: any, scope: IChangeLinr): any;
    }

    export interface IChangeLinrCache {
        [i: string]: any;
    }

    export interface IChangeLinrCacheFull {
        [i: string]: {
            [i: string]: any;
        }
    }

    export interface IChangeLinrSettings {
        pipeline: string[];
        transforms: {
            [i: string]: IChangeLinrTransform
        };
        doMakeCache?: boolean;
        doUseCache?: boolean;
    }

    export interface IChangeLinr {
        getCache(): IChangeLinrCache;
        getCached(key: string): any;
        getCacheFull(): IChangeLinrCacheFull;
        getDoMakeCache(): boolean;
        getDoUseCache(): boolean;
        process(data: any, key?: string, attributes?: any): any;
        processFull(data: any, key?: string, attributes?: any): any;
    }
}
