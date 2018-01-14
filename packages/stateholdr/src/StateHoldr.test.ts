import { expect } from "chai";

import { stubChangedCollection, stubCollection, stubItemsHoldr, stubStateHoldr } from "./fakes.test";
import { IChangeGroup, ICollection } from "./IStateHoldr";

describe("StateHoldr", () => {
    describe("addChange", () => {
        it("updates the collection's value", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.setCollection("exampleCollection", stubCollection());
            stateHolder.addChange("car", "color", "blue");

            // Assert
            expect(stateHolder.getCollection()).to.deep.equal(stubChangedCollection());
        });
    });

    describe("addCollectionChange", () => {
        it("updates the current collection", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.setCollection("exampleCollection", stubCollection());
            stateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

            // Assert
            expect(stateHolder.getCollection()).to.deep.equal(stubChangedCollection());
        });

        it("updates a non-current collection", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();
            const collection: ICollection = {
                car: {
                    color: "black",
                },
            };

            // Act
            stateHolder.setCollection("exampleCollection", stubCollection());
            stateHolder.setCollection("anotherCollection", collection);
            stateHolder.addCollectionChange("exampleCollection", "car", "color", "blue");

            // Assertt
            expect(stateHolder.getOtherCollection("exampleCollection")).to.deep.equal(stubChangedCollection());
        });
    });

    describe("applyChanges", () => {
        it("copies objects to a recipient", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();
            const recipient: IChangeGroup = {};

            // Act
            stateHolder.setCollection("exampleCollection", stubCollection());
            stateHolder.applyChanges("car", recipient);

            // Assert
            expect(recipient).to.deep.equal({ color: "red" });
        });

        it("only shallow copies objects to a recipient", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();
            const changedGroup = "car";
            const changedKey = "manufacturer";
            const collection: ICollection = {
                [changedGroup]: {
                    [changedKey]: {
                        color: "red",
                    },
                },
            };
            const recipient: IChangeGroup = {};

            // Act
            stateHolder.setCollection("exampleCollection", collection);
            stateHolder.applyChanges(changedGroup, recipient);

            // Assert
            expect(recipient[changedKey]).to.equal(collection[changedGroup][changedKey]);
        });
    });

    describe("saveCollection", () => {
        it("saves the collectionKeys list", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.setCollection("exampleCollection", stubCollection());
            stateHolder.saveCollection();

            // Assert
            expect(stateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal(["StateHolderexampleCollection"]);
        });

        it("saves collectionKeys as an empty array", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.saveCollection();

            // Assert
            expect(stateHolder.getItemsHolder().getItem("StateHoldercollectionKeys")).to.deep.equal([]);
        });
    });

    describe("setCollection", () => {
        it("sets collectionKeyRaw", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.setCollection("newCollection", stubCollection());

            // Assert
            expect(stateHolder.getCollectionKeyRaw()).to.equal("newCollection");
        });

        it("sets collectionKey", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr({
                itemsHolder: stubItemsHoldr(),
                prefix: "prefix",
            });

            // Act
            stateHolder.setCollection("newCollection", stubCollection());

            // Assert
            expect(stateHolder.getCollectionKey()).to.equal("prefixnewCollection");
        });

        it("sets the collection", (): void => {
            // Arrange
            const stateHolder = stubStateHoldr();

            // Act
            stateHolder.setCollection("newCollection", stubCollection());

            // Assert
            expect(stateHolder.getCollection()).to.deep.equal(stubCollection());
        });
    });
});
