import { expect } from "chai";
import { stub } from "sinon";

import { stubObjectMakr } from "./fakes";

// tslint:disable:function-constructor completed-docs

describe("ObjectMakr", () => {
    describe("make", () => {
        it("creates objects that respect the prototype chain", (): void => {
            // Arrange
            const property = stub();
            const objectMaker = stubObjectMakr({
                inheritance: {
                    sample: {},
                },
                properties: {
                    sample: { property },
                },
            });

            // Act
            const madeObject = objectMaker.make<{ property: typeof property }>("sample");

            // Assert
            expect(madeObject.property).to.equal(property);
        });

        it("creates objects that respect a deep prototype chain", (): void => {
            // Arrange
            const parentProperty = new Function();
            const childProperty = new Function();
            const objectMaker = stubObjectMakr({
                inheritance: {
                    parent: {
                        child: {},
                    },
                },
                properties: {
                    child: {
                        property: childProperty,
                    },
                    parent: {
                        property: parentProperty,
                    },
                },
            });

            // Act
            const madeObject = objectMaker.make<{ property: typeof childProperty }>("child");

            // Assert
            expect(madeObject.property).to.equal(childProperty);
        });

        it("doesn't add prototype methods to created objects", (): void => {
            // Arrange
            const property = stub();
            const objectMaker = stubObjectMakr({
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
            const madeObject = objectMaker.make("sample");

            // Assert
            expect(madeObject.hasOwnProperty("property")).to.be.equal(false);
        });

        it("copies a property", (): void => {
            // Arrange
            const property = stub();
            const objectMaker = stubObjectMakr({
                inheritance: {
                    sample: {},
                },
            });

            // Act
            const madeObject = objectMaker.make<{ property: typeof property }>("sample", {
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
            const objectMaker = stubObjectMakr({
                indexMap,
                inheritance: {
                    thing: {},
                },
                properties: {
                    thing: propertyArray,
                },
            });

            // Act
            const madeObject = objectMaker.make<{ [i: string]: {} }>("thing");

            // Assert
            expect(madeObject[indexMap[0]]).to.be.equal(propertyArray[0]);
            expect(madeObject[indexMap[1]]).to.be.equal(propertyArray[1]);
        });
    });
});
