import { expect } from "chai";

import { mochaLoader } from "../main";
import { stubGameStartr } from "../utils/fakes";

mochaLoader.it("_", (): void => {
    expect(stubGameStartr).to.not.throw();
});
