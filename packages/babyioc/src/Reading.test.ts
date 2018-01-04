import { expect } from "chai";

import { getFunctionName } from "./Reading";

describe("Reading", () => {
    describe("getFunctionName", () => {
        it("returns the name of a function when there is a .name", () => {
            // Arrange
            const name = "test";
            const object = { name };

            // Act
            const result = getFunctionName(object);

            // Assert
            expect(result).to.be.equal(name);
        });

        it("returns the name of a function when there is no .name and .toString results in a function", () => {
            // Arrange
            const name = "test";
            const object = {
                toString() {
                    return `function ${name}() { /* ... */ }`;
                },
            };

            // Act
            const result = getFunctionName(object as any);

            // Assert
            expect(result).to.be.equal(name);
        });

        it("returns the name of a function when there is no .name and .toString results in a class", () => {
            // Arrange
            const name = "test";
            const object = {
                toString() {
                    return `class ${name} { /* ... */ }`;
                },
            };

            // Act
            const result = getFunctionName(object as any);

            // Assert
            expect(result).to.be.equal(name);
        });
    });
});
