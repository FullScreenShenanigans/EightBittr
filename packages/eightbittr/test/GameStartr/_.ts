import { mochaLoader } from "../main";
import { stubGameStartr } from "../utils/fakes";

mochaLoader.it("_", (): void => {
    chai.expect(stubGameStartr()).to.not.throw;
});