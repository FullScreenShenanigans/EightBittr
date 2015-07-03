// @echo '/// <reference path="ItemsHoldr-0.2.1.ts" />'

// @ifdef INCLUDE_DEFINITIONS
/// <reference path="References/ItemsHoldr-0.2.1.ts" />
/// <reference path="StateHoldr.d.ts" />
// @endif

// @include ../Source/StateHoldr.d.ts

module StateHoldr {
    "use strict";

    export class StateHoldr {

        // The StatsHoldr instance that stores data
        private ItemsHolder: ItemsHoldr.IItemsHoldr;

        // A String prefix used for the ItemsHolder keys
        private prefix: string;

        // The current String key for the collection, with the prefix
        private collectionKey: string;

        // The current String key for the collection, without the prefix
        private collectionKeyRaw: string;

        // The current Object with attributes saved within
        private collection: any;

        /**
         * 
         */
        constructor(settings: IStateHoldrSettings) {
            if (!settings.ItemsHolder) {
                throw new Error("No ItemsHolder given to StateHoldr.");
            }

            this.ItemsHolder = settings.ItemsHolder;
            this.prefix = settings.prefix || "StateHolder";
        }


        /* Simple gets
        */

        /**
         * 
         */
        getItemsHolder(): ItemsHoldr.IItemsHoldr {
            return this.ItemsHolder;
        }

        /**
         * 
         */
        getPrefix(): string {
            return this.prefix;
        }

        /**
         * 
         */
        getCollectionKeyRaw(): string {
            return this.collectionKeyRaw;
        }

        /**
         * 
         */
        getCollectionKey(): string {
            return this.collectionKey;
        }

        /**
         * 
         */
        getCollection(): any {
            return this.collection;
        }

        /**
         * 
         */
        getOtherCollection(otherCollectionKeyRaw: string): void {
            var otherCollectionKey: string = this.prefix + otherCollectionKeyRaw;

            this.ensureCollectionKeyExists(otherCollectionKey);

            return this.ItemsHolder.getItem(otherCollectionKey);
        }

        /**
         * 
         */
        getChanges(itemKey: string): any {
            return this.collection[itemKey];
        }

        /**
         * 
         */
        getChange(itemKey: string, valueKey: string): void {
            return this.collection[itemKey][valueKey];
        }
    

        /* Storage
        */

        /**
         * 
         */
        setCollection(collectionKeyNew: string, value: string): void {
            this.collectionKeyRaw = collectionKeyNew;
            this.collectionKey = this.prefix + this.collectionKeyRaw;

            this.ensureCollectionKeyExists(this.collectionKey);

            if (value) {
                this.ItemsHolder.setItem(this.collectionKey, value);
            }

            this.collection = this.ItemsHolder.getItem(this.collectionKey);
        }

        /**
         * 
         */
        saveCollection(): void {
            this.ItemsHolder.setItem(this.collectionKey, this.collection);
        }

        /**
         * 
         */
        addChange(itemKey: string, valueKey: string, value: any) {
            if (typeof this.collection[itemKey] === "undefined") {
                this.collection[itemKey] = {};
            }

            this.collection[itemKey][valueKey] = value;
        }

        /**
         * 
         */
        addCollectionChange(collectionKeyOtherRaw: string, itemKey: string, valueKey: string, value: any): void {
            var collectionKeyOther = this.prefix + collectionKeyOtherRaw,
                otherCollection;

            this.ensureCollectionKeyExists(collectionKeyOther);
            otherCollection = this.ItemsHolder.getItem(collectionKeyOther);

            if (typeof otherCollection[itemKey] === "undefined") {
                otherCollection[itemKey] = {};
            }

            otherCollection[itemKey][valueKey] = value;

            this.ItemsHolder.setItem(collectionKeyOther, otherCollection);
        }

        /**
         * 
         */
        applyChanges(id: string, output: any): void {
            var changes = this.collection[id],
                key;

            if (!changes) {
                return;
            }

            for (key in changes) {
                output[key] = changes[key];
            }
        }

        /* Utilities
        */

        /**
         * 
         */
        private ensureCollectionKeyExists(collectionKey: string): void {
            if (!this.ItemsHolder.hasKey(collectionKey)) {
                this.ItemsHolder.addItem(collectionKey, {
                    "valueDefault": {},
                    "storeLocally": true
                });
            }
        }
    }
}
