var ObjectMaker,
    inheritance = {
        "Shape": {
            "Rectangle": {
                "Square": {},
                "TwoByFour": {}
            }
        }
    },
    properties = {
        "Rectangle": {
            "numSides": 4,
            "equalSides": false,
            "getArea": function () {
                return this.width * this.height
            }
        },
        "Square": {
            "equalSides": true
        }
    },
    indexMap = ["width", "height"];

describe("constructor", function () {
    it("throws an error when not given inheritance", function () {
        chai.expect(function () {
            new ObjectMakr.ObjectMakr({});
        }).to.throw("No inheritance given to ObjectMakr.");
    });

    it("initializes inheritance", function () {
        chai.expect(new ObjectMakr.ObjectMakr({
            "inheritance": inheritance
        }).getInheritance()).to.deep.equal(inheritance);
    });

    it("initializes properties", function () {
        chai.expect(new ObjectMakr.ObjectMakr({
            "inheritance": inheritance,
            "properties": properties
        }).getProperties()).to.deep.equal(properties);
    });
});

describe("make", function () {
    var ObjectMaker = new ObjectMakr.ObjectMakr({
        "inheritance": inheritance,
        "properties": properties
    });

    it("doesn't throw an error for known objects", function () {
        ObjectMaker.make("Shape");
        ObjectMaker.make("Rectangle");
        ObjectMaker.make("Square");
        ObjectMaker.make("TwoByFour");
    });

    it("throws an error for unknown objects", function () {
        chai.expect(function () {
            ObjectMaker.make("nope")
        }).to.throw("Unknown type given to ObjectMakr: nope");
    });

    it("creates basic objects", function () {
        var shape = ObjectMaker.make("Shape"),
            rectangle = ObjectMaker.make("Rectangle"),
            square = ObjectMaker.make("Square");

        chai.expect(shape.numSides).to.undefined;

        chai.expect(rectangle.numSides).to.equal(4);
        chai.expect(rectangle.equalSides).to.false;

        chai.expect(square.equalSides).to.true;
    });
});

describe("indexMap", function () {
    properties.TwoByFour = [2, 4];

    var ObjectMaker = new ObjectMakr.ObjectMakr({
        "inheritance": inheritance,
        "properties": properties,
        "indexMap": indexMap
    });

    it("stores indexMap", function () {
        chai.expect(ObjectMaker.getIndexMap()).to.deep.equal(indexMap);
    });

    it("makes using indexMap", function () {
        var plank = ObjectMaker.make("TwoByFour");

        chai.expect(plank.width).to.equal(2);
        chai.expect(plank.height).to.equal(4);
        chai.expect(plank.getArea()).to.equal(8);
    });
});

describe("propertiesFull", function () {
    var ObjectMaker = new ObjectMakr.ObjectMakr({
        "inheritance": inheritance,
        "properties": properties,
        "doPropertiesFull": true
    });

    it("stores regular properties correctly", function () {
        chai.expect(ObjectMaker.getFullPropertiesOf("Shape")).to.deep.equal({});
        chai.expect(Object.keys(ObjectMaker.getFullPropertiesOf("Rectangle"))).to.deep.equal([
            "numSides", "equalSides", "getArea"
        ]);
    });

    it("percolates properties down", function () {
        chai.expect(Object.keys(ObjectMaker.getFullPropertiesOf("Square"))).to.deep.equal([
                "numSides", "equalSides", "getArea"
        ]);
    });
});