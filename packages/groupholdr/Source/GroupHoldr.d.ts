declare module GroupHoldr {
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
        (value: any, key?: string | number): void;
    }

    export interface IGroupHoldrObjectAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: string): void;
    }

    export interface IGroupHoldrArrayAddFunction extends IGroupHoldrAddFunction {
        (value: any, key: number): void;
    }

    export interface IGroupHoldrDeleteFunction extends IGroupHoldrFunction {
        (arg1: any, arg2?: any): void;
    }

    export interface IGroupHoldrArrayDeleteFunction extends IGroupHoldrDeleteFunction {
        (value: any, index?: number): void;
    }

    export interface IGroupHoldrObjectDeleteFunction extends IGroupHoldrDeleteFunction {
        (key: string): void;
    }

    export interface IGroupHoldrFunctionGroup<T extends IGroupHoldrFunction> {
        [i: string]: T;
    }

    export interface IGroupHoldrFunctionGroups {
        "setGroup": IGroupHoldrFunctionGroup<IGroupHoldrSetGroupFunction>;
        "getGroup": IGroupHoldrFunctionGroup<IGroupHoldrGetGroupFunction>;
        "set": IGroupHoldrFunctionGroup<IGroupHoldrSetFunction>;
        "get": IGroupHoldrFunctionGroup<IGroupHoldrGetFunction>;
        "add": IGroupHoldrFunctionGroup<IGroupHoldrAddFunction>;
        "delete": IGroupHoldrFunctionGroup<IGroupHoldrDeleteFunction>;
    }

    export interface IGroupHoldrSettings {
        /**
         * The names of groups to be creaed.
         */
        groupNames: string[];

        /**
         * The mapping of group types. This can be a single String ("Array" or
         * "Object") to set each one, or an Object mapping each groupName to 
         * a different String (type).
         */
        groupTypes: string | {
            [i: string]: string;
        };
    }

    export interface IGroupHoldr {
        getFunctions(): IGroupHoldrFunctionGroups;
        getGroups(): IGroupHoldrGroups;
        getGroup(name: string): { [i: string]: any } | any[];
        getGroupNames(): string[];
        switchMemberGroup(value: any, groupNameOld: string, groupNameNew: string, keyOld?: string | number, keyNew?: string | number): void;
        applyAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        applyOnAll(scope: any, func: (...args: any[]) => any, args?: any[]): void;
        callAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        callOnAll(scope: any, func: (...args: any[]) => any, ...args: any[]): void;
        clearArrays(): void;
    }
}
