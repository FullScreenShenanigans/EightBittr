declare module "IObjectMakr" {
    export interface IClassInheritance {
        [i: string]: IClassInheritance;
    }
    export interface IClassProperties {
        [i: string]: any;
    }
    export interface IClassFunctions {
        [i: string]: IClassFunction;
    }
    export interface IClassFunction {
        new (): any;
    }
    export interface IOnMakeFunction {
        (output: any, name: string, settings: any, defaults: any): any;
    }
    export interface IObjectMakrSettings {
        inheritance: IClassInheritance;
        properties?: IClassProperties;
        doPropertiesFull?: boolean;
        indexMap?: any[];
        onMake?: string;
    }
    export interface IObjectMakr {
        getInheritance(): any;
        getProperties(): any;
        getPropertiesOf(title: string): any;
        getFullProperties(): any;
        getFullPropertiesOf(title: string): any;
        getFunctions(): IClassFunctions;
        getFunction(name: string): IClassFunction;
        hasFunction(name: string): boolean;
        getIndexMap(): any[];
        make(name: string, settings?: any): any;
    }
}
declare module "ObjectMakr" {
    import { IClassFunction, IClassFunctions, IObjectMakr, IObjectMakrSettings } from "IObjectMakr";
    export class ObjectMakr implements IObjectMakr {
        private inheritance;
        private properties;
        private functions;
        private doPropertiesFull;
        private propertiesFull;
        private indexMap;
        private onMake;
        constructor(settings: IObjectMakrSettings);
        getInheritance(): any;
        getProperties(): any;
        getPropertiesOf(title: string): any;
        getFullProperties(): any;
        getFullPropertiesOf(title: string): any;
        getFunctions(): IClassFunctions;
        getFunction(name: string): IClassFunction;
        hasFunction(name: string): boolean;
        getIndexMap(): any[];
        make(name: string, settings?: any): any;
        private processProperties(properties);
        private processPropertyArray(properties);
        private processFunctions(base, parent, parentName?);
        private proliferate(recipient, donor, noOverride?);
    }
}
