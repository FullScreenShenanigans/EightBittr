import { expect } from "chai";
import { stub } from "sinon";

import { stubObjectMakr } from "./fakes";
import { IObjectMakr } from "./IObjectMakr";

describe("ObjectMakr", () => {
    describe("make", () => {
        it("creates objects that respect the prototype chain", (): void => {
            // Arrange
            const property = stub();
            const objectMakr = stubObjectMakr({
                inheritance: {
                    sample: {},
                },
                properties: {
                    sample: { property },
                },
            });

            // Act
            const madeObject = objectMakr.make<{ property: typeof property }>("sample");

            // Assert
            expect(madeObject.property).to.equal(property);
        });

        it("creates objects that respect a deep prototype chain", (): void => {
            // Arrange
            const parentProperty = new Function();
            const childProperty = new Function();
            const objectMakr = stubObjectMakr({
                inheritance: {
                    parent: {
                        child: {},
                    },
                },
                properties: {
                    parent: {
                        property: parentProperty,
                    },
                    child: {
                        property: childProperty,
                    },
                },
            });

            // Act
            const madeObject = objectMakr.make<{ property: typeof childProperty }>("child");

            // Assert
            expect(madeObject.property).to.equal(childProperty);
        });

        it("doesn't add prototype methods to created objects", (): void => {
            // Arrange
            const property = stub();
            const objectMakr = stubObjectMakr({
                inheritance: {
                    sample: {},
                },
                properties: {
                    sample: {
                        property,
                    },
                },
            });

            // Act
            const madeObject = objectMakr.make("sample");

            // Assert
            expect(madeObject.hasOwnProperty("property")).to.be.equal(false);
        });

        it("copies a property", (): void => {
            // Arrange
            const property = stub();
            const objectMakr = stubObjectMakr({
                inheritance: {
                    sample: {},
                },
            });

            // Act
            const madeObject = objectMakr.make<{ property: typeof property }>("sample", {
                property,
            });

            // Assert
            expect(madeObject.property).to.equal(property);
        });
    });

    describe("indexMap", () => {
        it("creates an object with the mapped properties", (): void => {
            // Arrange
            const indexMap = ["foo", "bar"];
            const propertyArray = [{}, {}];
            const objetMaker = stubObjectMakr({
                inheritance: {
                    thing: {},
                },
                properties: {
                    thing: propertyArray,
                },
                indexMap,
            });

            // Act
            const madeObject = objetMaker.make<{ [i: string]: {} }>("thing");

            // Assert
            expect(madeObject[indexMap[0]]).to.be.equal(propertyArray[0]);
            expect(madeObject[indexMap[1]]).to.be.equal(propertyArray[1]);
        });
    });
});
