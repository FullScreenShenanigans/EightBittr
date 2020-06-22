import { expect } from "chai";
import { ChangeLinr } from "./ChangeLinr";

describe("ChangeLinr", () => {
    it("_", () => {
        expect(
            () =>
                new ChangeLinr({
                    pipeline: [],
                    transforms: {},
                })
        ).not.to.throw();
    });
});
