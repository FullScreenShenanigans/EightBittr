declare module ObjectMakr {
    export interface IObjectMakrClassInheritance {
        [i: string]: string | IObjectMakrClassInheritance;
    }

    export interface IObjectMakrClassProperties {
        [i: string]: any;
    }

    export interface IObjectMakrSettings {
        inheritance: any;
        properties?: { [i: string]: any };
        doPropertiesFull?: boolean;
        indexMap?: any;
        onMake?: string;
    }

    export interface IObjectMakrClassFunction {
        new ();
    }

    export interface IObjectMakr {
        getInheritance(): any;
        getProperties(): any;
        getPropertiesOf(title: string): any;
        getFullProperties(): any;
        getFullPropertiesOf(title: string): any;
        getFunctions(): any;
        getFunction(name: string): Function;
        hasFunction(name: string): boolean;
        getIndexMap(): any;
        make(name: string, settings?: any): any;
    }
}