import { expect } from "chai";

import { convertTitleToId } from "./convertTitleToId";

describe("convertTitleToId", () => {
    for (const [title, input, expected] of [
        ["returns the title lowercased when the title is alpha-only", "abcDEF", "abcdef"],
        ["replaces non-alpha characters when the title includes them", "a-B.#c ", "a-b-c-"],
    ]) {
        it(title, () => {
            // Act
            const actual = convertTitleToId(input);

            // Assert
            expect(actual).to.be.equal(expected);
        });
    }
});
