import { IObjectMakr } from "../../src/IObjectMakr";
import { fakes } from "../utils/fakes";
import { mochaLoader } from "../main";

mochaLoader.it("creates an object with the mapped properties", (): void => {
    // Arrange
    const indexMap = ["foo", "bar"];
    const propertyArray = [{}, {}];
    const ObjectMaker: IObjectMakr = fakes.stubObjectMakr({
        inheritance: {
            "thing": {}
        },
        properties: {
            "thing": propertyArray
        },
        indexMap: indexMap
    });

    // Act
    const madeObject: any = ObjectMaker.make("thing");

    // Assert
    chai.expect(madeObject[indexMap[0]]).to.be.equal(propertyArray[0]);
    chai.expect(madeObject[indexMap[1]]).to.be.equal(propertyArray[1]);
});
