/// <reference path="../../node_modules/@types/chai/index.d.ts" />
/// <reference path="../../node_modules/@types/mocha/index.d.ts" />
/// <reference path="../utils/MochaLoader.ts" />

import { mochaLoader } from "../main";
import { mocks } from "../utils/mocks";

mochaLoader.it("_", (): void => {
    chai.expect(() => mocks.mockModAttachr()).to.not.throw();
});
