declare module GroupHoldr {
    export interface IGroupHoldrSettings {
        // The listing of group names.
        groupNames: string[];

        // The mapping of group types. This can be a String ("Array" or
        // "Object") to set each one, or an Object mapping each groupName
        // to a different String.
        groupTypes: string | {
            [i: string]: string;
        };
    }

    export interface IGroupHoldrGroups {
        [i: string]: { [i: string]: any } | any[];
    }

    export interface IGroupHoldrTypesListing {
        [i: string]: (...args: any[]) => void; // Array or Object
    }

    export interface IGroupHoldrTypeNamesListing {
        [i: string]: string;
    }

    export interface IGroupHoldrFunction { }

    export interface IGroupHoldrSetGroupFunction extends IGroupHoldrFunction {
        (value: any | any[]): void;
    }

    export interface IGroupHoldrGetGroupFunction extends IGroupHoldrFunction {
        (): any | any[];
    }

    export interface IGroupHoldrSetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }

    export interface IGroupHoldrGetFunction extends IGroupHoldrFunction {
        (key: string | number, value?: any): void;
    }

    export interface IGroupHoldrAddFunction extends IGroupHoldrFunction {
        (key: string, value?: any): void;
    }

    export interface IGroupHoldrObjectAddFunction extends IGroupHoldrAddFunction {
        (key: string, value: any): void;
    }

    export interface IGroupHoldrArrayAddFunction extends IGroupHoldrAddFunction {
        (value: any): void;
    }

    export interface IGroupHoldrDeleteFunction extends IGroupHoldrFunction {
        (key: any): void;
    }

    export interface IGroupHoldrArrayDeleteFunction extends IGroupHoldrDeleteFunction { }

    export interface IGroupHoldrObjectDeleteFunction extends IGroupHoldrDeleteFunction {
        (key: string): void;
    }

    export interface IGroupHoldrFunctionGroup<t extends IGroupHoldrFunction> {
        [i: string]: t;
    }

    export interface IGroupHoldrFunctionGroups {
        "setGroup": IGroupHoldrFunctionGroup<IGroupHoldrSetGroupFunction>;
        "getGroup": IGroupHoldrFunctionGroup<IGroupHoldrGetGroupFunction>;
        "set": IGroupHoldrFunctionGroup<IGroupHoldrSetFunction>;
        "get": IGroupHoldrFunctionGroup<IGroupHoldrGetFunction>;
        "add": IGroupHoldrFunctionGroup<IGroupHoldrAddFunction>;
        "delete": IGroupHoldrFunctionGroup<IGroupHoldrDeleteFunction>;
    }

    export interface IGroupHoldr {
        getFunctions(): IGroupHoldrFunctionGroups;
        getGroups(): IGroupHoldrGroups;
        getGroup(): { [i: string]: any } | any[];
        getGroupNames(): string[];
        deleteObject(groupName: string, value: any): void;
        deleteIndex(groupName: string, index: number, max?: number): void;
        switchObjectGroup(value: any, groupOld: string, groupNew: string, keyNew?: string): void;
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        callAll(scope: any, func: (...args: any[]) => any): void;
        callOnAll(scope: any, func: (...args: any[]) => any): void;
        clearArrays(): void;
    }
}