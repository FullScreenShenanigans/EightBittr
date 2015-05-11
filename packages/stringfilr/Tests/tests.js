var normal = "color",
    library = {
        "my": {
            "color": {
                "eye": "blue-green",
                "hair": "dirty blonde"
            },
            "major": "Computer Science"
        },
        "Mariah's": {
            "color": {
                "eye": "brown",
                "hair": "blonde"
            },
            "major": "Biomedical Engineering"
        },
        "Brandon's": {
            "color": {
                "eye": "black",
                "hair": "black"
            },
            "major": "Computer Science"
        }
    },
    StringFiler;

describe("constructor", function () {
    it("throws an error if not given settings", function () {
        chai.expect(function () {
            new StringFilr();
        }).to.throw("No settings given to StringFilr.");
    });

    it("throws an error if not given library", function () {
        chai.expect(function () {
            new StringFilr({});
        }).to.throw("No library given to StringFilr.");
    });

    it("runs", function () {
        StringFiler = new StringFilr({
            "normal": normal,
            "library": library
        });
    });

    it("stores normal", function () {
        chai.expect(StringFiler.getNormal()).to.be.equal(normal);
    });

    it("stores library", function () {
        chai.expect(StringFiler.getLibrary()).to.be.equal(library);
    });

    it("initializes a blank cache", function () {
        chai.expect(StringFiler.getCache()).to.be.deep.equal({});
    });
});

describe("get", function () {
    it("gets values", function () {
        chai.expect(StringFiler.get("my major")).to.be.equal("Computer Science");
    });

    it("gets values out of order", function () {
        chai.expect(StringFiler.get("Mariah's eye color")).to.be.equal("brown");
    });

    it("gets values using normal", function () {
        chai.expect(StringFiler.get("Brandon's hair")).to.be.equal("black");
    });
});

describe("cache", function () {
    it("stores values", function () {
        chai.expect(StringFiler.getCached("my major")).to.be.equal("Computer Science");
        chai.expect(StringFiler.getCache()).to.be.deep.equal({
            "my major": "Computer Science",
            "Mariah's eye ": "brown",
            "Mariah's eye color": "brown",
            "Brandon's hair": "black"
        });
    });

    it("doesn't store unused values", function () {
        chai.expect(StringFiler.getCached("ooga booga")).to.be.undefined;
    });

    it("clears on demand", function () {
        StringFiler.clearCached("my major");
        chai.expect(StringFiler.getCached("my major")).to.be.undefined;
    });
});