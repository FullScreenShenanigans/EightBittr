declare module StateHoldr {
    export interface IStateHoldrSettings {
        ItemsHolder: ItemsHoldr.IItemsHoldr;
        prefix?: string;
    }

    export interface IStateHoldr {
        getItemsHolder(): ItemsHoldr.IItemsHoldr;
        getPrefix(): string;
        getCollectionKey(): string;
        getCollectionKeyRaw(): string;
        getCollection(): any;
        getOtherCollection(otherCollectionKeyRaw: string): void;
        getChanges(itemKey: string): any;
        getChange(itemKey: string, valueKey: string): any;
        setCollection(collectionKeyRawNew: string, value?: any): void;
        saveCollection(): void;
        addChange(itemKey: string, valueKey: string, value: any): void;
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void;
        applyChanges(itemKey: string, output: any): void;
    }
}
