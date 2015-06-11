describe("constructor", function () {
    it("throws an error when not given a pipeline", function () {
        chai.expect(function () {
            var ChangeLiner = new ChangeLinr.ChangeLinr({
                "transforms": {}
            });
        }).to.throw("No pipeline given to ChangeLinr.");
    });

    it("throws an error when not given transforms", function () {
        chai.expect(function () {
            var ChangeLiner = new ChangeLinr.ChangeLinr({
                "pipeline": []
            });
        }).to.throw("No transforms given to ChangeLinr.");
    });

    it("ensures each part of the pipeline isn't falsy", function () {
        chai.expect(function () {
            var ChangeLiner = new ChangeLinr.ChangeLinr({
                "transforms": {},
                "pipeline": [""]
            });
        }).to.throw("Pipe[0] is invalid.")
    });

    it("ensures each part of the pipeline exists", function () {
        chai.expect(function () {
            var ChangeLiner = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "test": function () { }
                },
                "pipeline": ["typo"]
            });
        }).to.throw("Pipe[0] (\"typo\") not found in transforms.")
    });

    it("ensures each part of the pipeline is a Function", function () {
        chai.expect(function () {
            var ChangeLiner = new ChangeLinr.ChangeLinr({
                "transforms": {
                    "test": "Hello world!"
                },
                "pipeline": ["test"]
            });
        }).to.throw("Pipe[0] (\"test\") is not a valid Function from transforms.")
    });

    it("starts with a blank cache", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {},
            "pipeline": []
        });

        chai.expect(ChangeLiner.getCache()).to.be.deep.equal({});
    });

    it("starts with a blank cacheFull entry for each pipeline", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {
                "test": function () {}
            },
            "pipeline": ["test"]
        });

        chai.expect(ChangeLiner.getCacheFull()).to.be.deep.equal({
            "0": {},
            "test": {}
        });
    });
});

describe("process", function () {
    it("correctly computes a single pipeline transform", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {
                "double": function (number) {
                    return number * 2;
                }
            },
            "pipeline": ["double"]
        });

        chai.expect(ChangeLiner.process(2)).to.be.equal(4);
    });

    it("correctly computes multiple pipeline transforms", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {
                "double": function (number) {
                    return number * 2;
                },
                "triple": function (number) {
                    return number * 3;
                }
            },
            "pipeline": ["double", "triple"]
        });

        chai.expect(ChangeLiner.process(2)).to.be.equal(12);
        chai.expect(ChangeLiner.process(2)).to.be.equal(12);
    });
});

describe("cache", function () {
    it("caches the result of process calls", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {
                "double": function (number) {
                    return number * 2;
                }
            },
            "pipeline": ["double"]
        });

        ChangeLiner.process(2);
        chai.expect(ChangeLiner.getCached(2)).to.be.equal(4);
        chai.expect(ChangeLiner.getCached("nope")).to.be.equal(undefined);
    });

    it("caches the keyed result of process calls when given keys", function () {
        var ChangeLiner = new ChangeLinr.ChangeLinr({
            "transforms": {
                "double": function (number) {
                    return number * 2;
                }
            },
            "pipeline": ["double"]
        });

        ChangeLiner.process(2, "two");
        chai.expect(ChangeLiner.getCached("two")).to.be.equal(4);
    });
});
