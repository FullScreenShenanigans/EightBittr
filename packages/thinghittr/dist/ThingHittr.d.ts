declare module "IThingHittr" {
    export interface IThing {
        groupType: string;
        numQuadrants: number;
        quadrants: IQuadrant[];
        type: string;
    }
    export interface IQuadrant {
        things: {
            [i: string]: IThing[];
        };
    }
    export interface IGroupHitList {
        [i: string]: string[];
    }
    export interface IGlobalCheck {
        (thing: IThing): boolean;
    }
    export interface IHitsCheck {
        (thing: IThing): void;
    }
    export interface IHitCheck {
        (thing: IThing, other: IThing): boolean;
    }
    export interface IHitCallback {
        (thing: IThing, other: IThing): void;
    }
    export type IThingFunction = IGlobalCheck | IHitsCheck | IHitCheck | IHitCallback;
    export interface IThingFunctionGenerator<T extends IThingFunction> {
        (): T;
    }
    export interface IThingFunctionGeneratorContainer<T extends IThingFunction> {
        [i: string]: IThingFunctionGenerator<T>;
    }
    export interface IThingFunctionGeneratorContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionGeneratorContainer<T>;
    }
    export interface IThingFunctionContainer<T extends IThingFunction> {
        [i: string]: T;
    }
    export interface IThingFunctionContainerGroup<T extends IThingFunction> {
        [i: string]: IThingFunctionContainer<T>;
    }
    export interface IThingHittrSettings {
        keyNumQuads?: string;
        keyQuadrants?: string;
        keyGroupName?: string;
        keyTypeName?: string;
        globalCheckGenerators: IThingFunctionGeneratorContainer<IGlobalCheck>;
        hitCheckGenerators: IThingFunctionGeneratorContainerGroup<IHitCheck>;
        hitCallbackGenerators: IThingFunctionGeneratorContainerGroup<IHitCallback>;
    }
    export interface IThingHittr {
        cacheChecksForType(typeName: string, groupName: string): void;
        checkHitsForThing(thing: IThing): void;
        checkHitForThings(thing: IThing, other: IThing): boolean;
        runHitCallbackForThings(thing: IThing, other: IThing): void;
    }
}
declare module "ThingHittr" {
    import { IThing, IThingHittr, IThingHittrSettings } from "IThingHittr";
    export class ThingHittr implements IThingHittr {
        private groupHitLists;
        private globalCheckGenerators;
        private hitCheckGenerators;
        private hitCallbackGenerators;
        private generatedGlobalChecks;
        private generatedHitChecks;
        private generatedHitCallbacks;
        private generatedHitsChecks;
        constructor(settings: IThingHittrSettings);
        cacheChecksForType(typeName: string, groupName: string): void;
        checkHitsForThing(thing: IThing): void;
        checkHitForThings(thing: IThing, other: IThing): boolean;
        runHitCallbackForThings(thing: IThing, other: IThing): void;
        private generateHitsCheck(typeName);
        private runThingsFunctionSafely(group, thing, other, generators);
        private generateGroupHitLists(group);
    }
}
