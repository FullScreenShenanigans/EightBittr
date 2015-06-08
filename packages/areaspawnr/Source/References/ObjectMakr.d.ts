declare module ObjectMakr {
    export interface IObjectMakrSettings {
        inheritance: any;
        properties?: any;
        doPropertiesFull?: boolean;
        indexMap?: any;
        onMake?: string;
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