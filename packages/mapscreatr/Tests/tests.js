var groupTypes = ["Solid", "Character"],
    keyGroupType = "groupType",
    keyEntrance = "entrance",
    macros = {
        "OneEnemy": function (reference) {
            return {
                "thing": "Enemy",
                "x": reference.x,
                "y": reference.y
            }
        },
        "ManyEnemies": function (reference, prethings, area, map, scope) {
            var output = [],
                dx = reference.dx,
                x = reference.x,
                y = reference.y,
                i;

            for (i = 0; i < scope.numEnemies; i += 1) {
                output.push({
                    "macro": "OneEnemy",
                    "x": x,
                    "y": y
                });

                x += dx;
            }

            return output;
        }
    },
    scope = {
        "numEnemies": 7
    },
    requireEntrance = true,
    ObjectMaker = new ObjectMakr.ObjectMakr({
        "inheritance": {
            "Map": {},
            "Area": {},
            "Location": {},
            "Thing": {
                "Solid": {
                    "Block": {},
                    "Floor": {}
                },
                "Character": {
                    "Player": {},
                    "Enemy": {}
                }
            },
        },
        "properties": {
            "Thing": {
                "width": 8,
                "height": 8
            },
            "Solid": {
                "groupType": "Solid"
            },
            "Block": {
                "title": "Block"
            },
            "Floor": {
                "title": "Floor"
            },
            "Character": {
                "groupType": "Character"
            },
            "Player": {
                "title": "Player"
            },
            "Enemy": {
                "title": "Enemy"
            }
        },
        "doPropertiesFull": true
    }),
    MapsCreator;

describe("constructor", function () {
    it("throws an error if not given settings", function () {
        chai.expect(function () {
            new MapsCreatr.MapsCreatr();
        }).to.throw("No settings object given to MapsCreatr.");
    });

    it("throws an error if not given an ObjectMakr", function () {
        chai.expect(function () {
            new MapsCreatr.MapsCreatr({
                "groupTypes": groupTypes
            });
        }).to.throw("No ObjectMakr given to MapsCreatr.");
    });

    it("throws an error if the ObjectMakr doesn't store full properties", function () {
        chai.expect(function () {
            new MapsCreatr.MapsCreatr({
                "ObjectMaker": new ObjectMakr.ObjectMakr({
                    "inheritance": {}
                }),
                "groupTypes": groupTypes
            });
        }).to.throw("MapsCreatr's ObjectMaker must store full properties.");
    });

    it("throws an error if not given groupTypes", function () {
        chai.expect(function () {
            new MapsCreatr.MapsCreatr({
                "ObjectMaker": ObjectMaker
            });
        }).to.throw("No groupTypes given to MapsCreatr.");
    });

    it("runs", function () {
        MapsCreator = new MapsCreatr.MapsCreatr({
            "ObjectMaker": ObjectMaker,
            "groupTypes": groupTypes,
            "keyGroupType": keyGroupType,
            "keyEntrance": keyEntrance,
            "macros": macros,
            "scope": scope,
            "requireEntrance": requireEntrance
        });
    });

    it("sets ObjectMaker", function () {
        chai.expect(MapsCreator.getObjectMaker()).to.be.equal(ObjectMaker);
    });

    it("sets groupTypes", function () {
        chai.expect(MapsCreator.getGroupTypes()).to.be.equal(groupTypes);
    });

    it("sets keyGroupType", function () {
        chai.expect(MapsCreator.getKeyGroupType()).to.be.equal(keyGroupType);
    });

    it("sets keyEntrance", function () {
        chai.expect(MapsCreator.getKeyEntrance()).to.be.equal(keyEntrance);
    });

    it("sets macros", function () {
        chai.expect(MapsCreator.getMacros()).to.be.equal(macros);
    });

    it("sets scope", function () {
        chai.expect(MapsCreator.getScope()).to.be.equal(scope);
    });

    it("sets requireEntrance", function () {
        chai.expect(MapsCreator.getRequireEntrance()).to.be.equal(requireEntrance);
    });
});