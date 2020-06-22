import { expect } from "chai";

import { stubEightBittr } from "../fakes.test";

describe("Utilities", () => {
    describe("arraySwitch", () => {
        it("moves an object from one array to another", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const arrayOld = ["a", object, "b"];
            const arrayNew = ["c", "d"];

            // Act
            utilities.arraySwitch(object, arrayOld, arrayNew);

            // Assert
            expect(arrayNew.indexOf(object)).to.be.equal(arrayNew.length - 1);
        });

        it("moves a non-member object into a new array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const arrayOld = ["a", "b"];
            const arrayNew = ["c", "d"];

            // Act
            utilities.arraySwitch(object, arrayOld, arrayNew);

            // Assert
            expect(arrayNew.indexOf(object)).to.be.equal(arrayNew.length - 1);
        });
    });

    describe("arrayToBeginning", () => {
        it("splices an object from the end to the beginning of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b", object];

            // Act
            utilities.arrayToBeginning(object, array);

            // Assert
            expect(array.indexOf(object)).to.equal(0);
        });

        it("splices an non-member to the beginning of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b"];

            // Act
            utilities.arrayToBeginning(object, array);

            // Assert
            expect(array.indexOf(object)).to.equal(0);
        });
    });

    describe("arrayToEnd", () => {
        it("splices an object from the beginning of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = [object, "a", "b"];

            // Act
            utilities.arrayToEnd(object, array);

            // Assert
            expect(array.indexOf(object)).to.equal(array.length - 1);
        });

        it("splices a non-member to the end of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b"];

            // Act
            utilities.arrayToEnd(object, array);

            // Assert
            expect(array.indexOf(object)).to.equal(array.length - 1);
        });
    });

    describe("arrayToIndex", () => {
        it("splices an object from the beginning to the end of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = [object, "a", "b"];

            // Act
            utilities.arrayToIndex(object, array, array.length - 1);

            // Assert
            expect(array.indexOf(object)).to.equal(array.length - 1);
        });

        it("splices an object from the end to the beginning of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b", object];

            // Act
            utilities.arrayToIndex(object, array, 0);

            // Assert
            expect(array.indexOf(object)).to.equal(0);
        });

        it("splices an non-member to the beginning of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b"];

            // Act
            utilities.arrayToIndex(object, array, 0);

            // Assert
            expect(array.indexOf(object)).to.equal(0);
        });

        it("splices a non-member to the end of an array", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const object = "foo";
            const array = ["a", "b"];

            // Act
            utilities.arrayToIndex(object, array, array.length - 1);

            // Assert
            expect(array.indexOf(object)).to.equal(array.length - 1);
        });
    });

    describe("createCanvas", () => {
        it("creates a canvas", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();

            // Act
            const canvas = utilities.createCanvas(1, 1);

            // Assert
            expect(canvas.nodeName).to.be.equal("CANVAS");
        });

        it("creates a sized canvas", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const width = 7;
            const height = 14;

            // Act
            const canvas = utilities.createCanvas(width, height);

            // Assert
            expect(canvas.width).to.be.equal(width);
            expect(canvas.height).to.be.equal(height);
        });
    });

    describe("createElement", () => {
        it("creates a simple element", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();

            // Act
            const element = utilities.createElement("div");

            // Assert
            expect(element.nodeName).to.be.equal("DIV");
        });

        it("adds an object", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();

            // Act
            const element = utilities.createElement("div", {
                textContent: "foo",
            });

            // Assert
            expect(element.textContent).to.be.equal("foo");
        });

        it("adds multiple objects", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();

            // Act
            const element = utilities.createElement(
                "div",
                {
                    textContent: "foo",
                },
                {
                    style: {
                        color: "blue",
                    },
                }
            );

            // Assert
            expect(element.textContent).to.be.equal("foo");
            expect(element.style.color).to.be.equal("blue");
        });
    });

    describe("followPathHard", () => {
        it("follows an empty path nowhere", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = [];
            const object: any = {};

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(object);
        });

        it("follows a path of size 1", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo"];
            const object: any = {
                foo: {},
            };

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(object.foo);
        });

        it("follows a path of size 2", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo", "bar"];
            const object: any = {
                foo: {
                    bar: {},
                },
            };

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(object.foo.bar);
        });

        it("follows a path of size 3", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo", "bar", "baz"];
            const object: any = {
                foo: {
                    bar: {
                        baz: {},
                    },
                },
            };

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(object.foo.bar.baz);
        });

        it("respects a starting 0 index", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo", "bar", "baz"];
            const object: any = {
                foo: {
                    bar: {
                        baz: {},
                    },
                },
            };

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(object.foo.bar.baz);
        });

        it("respects a starting non-zero index", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo", "bar", "baz"];
            const object: any = {
                bar: {
                    baz: {},
                },
            };

            // Act
            const result = utilities.followPathHard(object, path, 1);

            // Assert
            expect(result).to.be.equal(object.bar.baz);
        });

        it("returns undefined when part of the path does not exist", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const path: string[] = ["foo"];
            const object: any = {};

            // Act
            const result = utilities.followPathHard(object, path);

            // Assert
            expect(result).to.be.equal(undefined);
        });
    });

    describe("proliferate", () => {
        it("adds shallow properties to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                bar: false,
                foo: true,
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
            expect(donor.bar).to.be.equal(recipient.bar);
        });

        it("adds deep copied objects to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                foo: {
                    bar: true,
                },
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("adds deep copied arrays to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                foo: [1, 2, 3],
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("overrides existing properties", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {
                foo: false,
            };
            const donor: any = {
                foo: true,
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
        });

        it("doesn't override existing properties when noOverrides is true", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {
                foo: false,
            };
            const donor: any = {
                foo: true,
            };

            // Act
            utilities.proliferate(recipient, donor, true);

            // Assert
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });
    });

    describe("proliferateElement", () => {
        it("adds shallow properties to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = document.createElement("div");
            const donor: any = {
                textContent: "text",
            };

            // Act
            utilities.proliferateElement(recipient, donor);

            // Assert
            expect(recipient.textContent).to.be.equal(donor.textContent);
        });

        it("overrides existing properties", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {
                textContent: false,
            };
            const donor: any = {
                foo: true,
            };

            // Act
            utilities.proliferateElement(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
        });

        it("doesn't override existing properties when noOverrides is true", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = document.createElement("div");
            recipient.textContent = "foo";
            const donor: any = {
                textContent: "bar",
            };

            // Act
            utilities.proliferateElement(recipient, donor, true);

            // Assert
            expect(recipient.textContent).to.not.be.equal(donor.foo);
        });

        it("adds styles", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = document.createElement("div");
            const donor: any = {
                style: {
                    color: "blue",
                },
            };

            // Act
            utilities.proliferateElement(recipient, donor);

            // Assert
            expect(recipient.style.color).to.be.equal(donor.style.color);
        });

        it("appends children", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = document.createElement("div");
            const donor: any = {
                children: [
                    document.createElement("span"),
                    document.createElement("span"),
                ],
            };

            // Act
            utilities.proliferateElement(recipient, donor);

            // Assert
            const children = [].slice.call(recipient.children);
            expect(children).to.be.deep.equal(donor.children);
        });

        it("appends options", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = document.createElement("select");
            const donor: any = {
                children: [
                    document.createElement("option"),
                    document.createElement("option"),
                ],
            };

            // Act
            utilities.proliferateElement(recipient, donor);

            // Assert
            const options = [].slice.call(recipient.options);
            expect(options).to.be.deep.equal(donor.children);
        });
    });

    describe("proliferateHard", () => {
        it("adds shallow properties to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                bar: false,
                foo: true,
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
            expect(donor.bar).to.be.equal(recipient.bar);
        });

        it("adds deep copied objects to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                foo: {
                    bar: true,
                },
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("adds deep copied arrays to a recipient", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {};
            const donor: any = {
                foo: [1, 2, 3],
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("overrides existing falsy properties", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {
                foo: false,
            };
            const donor: any = {
                foo: true,
            };

            // Act
            utilities.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
        });

        it("doesn't override existing properties when noOverrides is true", (): void => {
            // Arrange
            const { utilities } = stubEightBittr();
            const recipient: any = {
                foo: true,
            };
            const donor: any = {
                foo: false,
            };

            // Act
            utilities.proliferate(recipient, donor, true);

            // Assert
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });
    });
});
