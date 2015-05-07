var width = 1024,
    height = 768,
    variables = {
        "pixels": function () {
            return this.width * this.height;
        },
        "pixelsUnscoped": function (MapScreener) {
            return MapScreener.width * MapScreener.height;
        }
    },
    MapScreener;

describe("constructor", function () {
    it("throws an error if not given width", function () {
        chai.expect(function () {
            new MapScreenr({
                "height": height
            });
        }).to.throw("No width given to MapScreenr.");
    });

    it("throws an error if not given height", function () {
        chai.expect(function () {
            new MapScreenr({
                "width": width
            });
        }).to.throw("No height given to MapScreenr.");
    });

    it("sets positioning variables", function () {
        MapScreener = new MapScreenr({
            "width": width,
            "height": height
        });
        chai.expect(MapScreener.width).to.be.equal(width);
        chai.expect(MapScreener.height).to.be.equal(height);
    });
});

describe("variables", function () {
    it("are set on clearScreen", function () {
        MapScreener = new MapScreenr({
            "width": width,
            "height": height,
            "variables": variables,
            "variableArgs": [MapScreener]
        });

        MapScreener.clearScreen();

        chai.expect(MapScreener.top).to.be.equal(0);
        chai.expect(MapScreener.right).to.be.equal(width);
        chai.expect(MapScreener.bottom).to.be.equal(height);
        chai.expect(MapScreener.left).to.be.equal(0);

        chai.expect(MapScreener.middleX).to.be.equal(width / 2);
        chai.expect(MapScreener.middleY).to.be.equal(height / 2);

        chai.expect(MapScreener.pixels).to.be.equal(width * height);
    });

    it("change positioning on shift", function () {
        MapScreener.shift(7, 14);

        chai.expect(MapScreener.top).to.be.equal(14);
        chai.expect(MapScreener.right).to.be.equal(width + 7);
        chai.expect(MapScreener.bottom).to.be.equal(height + 14);
        chai.expect(MapScreener.left).to.be.equal(7);
    });
});