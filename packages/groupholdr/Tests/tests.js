var groupNames = ["Name", "Age"],
    groupTypes = {
        "Name": "Array",
        "Age": "Object"
    },
    GroupHolder;

describe("constructor", function () {
    it("throws an error if not given settings", function () {
        chai.expect(function () {
            new GroupHoldr.GroupHoldr();
        }).to.throw("No settings object given to GroupHoldr.");
    });

    it("throws an error if not given groupNames", function () {
        chai.expect(function () {
            new GroupHoldr.GroupHoldr({
                "groupTypes": groupTypes
            });
        }).to.throw("No groupNames given to GroupHoldr.");
    });

    it("throws an error if not given groupTypes", function () {
        chai.expect(function () {
            new GroupHoldr.GroupHoldr({
                "groupNames": groupNames
            });
        }).to.throw("No groupTypes given to GroupHoldr.");
    });

    it("works", function () {
        GroupHolder = new GroupHoldr.GroupHoldr({
            "groupNames": groupNames,
            "groupTypes": groupTypes
        });
    });
});

describe("basic getting", function () {
    it("gets group names", function () {
        chai.expect(GroupHolder.getGroupNames()).to.be.deep.equal([
            "Name", "Age"
        ]);
    });
    
    it("gets groups", function () {
        chai.expect(GroupHolder.getGroup("Name")).to.be.deep.equal([]);
        chai.expect(GroupHolder.getGroup("Age")).to.be.deep.equal({});
    });
});

describe("adding", function () {
    it("adds to Arrays", function () {
        GroupHolder.addName("Josh");
        GroupHolder.functions.add.Name("Brandon");
        GroupHolder.getGroup("Name").push("Mariah");

        chai.expect(GroupHolder.getNameGroup()).to.be.deep.equal([
            "Josh", "Brandon", "Mariah"
        ]);
    });

    it("adds to Objects", function () {
        GroupHolder.addAge(19, "Josh");
        GroupHolder.functions.add.Age(20, "Brandon");
        GroupHolder.getGroup("Age").Mariah = 21;

        chai.expect(GroupHolder.getGroups().Age).to.be.deep.equal({
            "Josh": 19,
            "Brandon": 20,
            "Mariah": 21
        });
    });
});

describe("deletion", function () {
    it("deletes from Arrays", function () {
        GroupHolder.deleteName("Josh");
        chai.expect(GroupHolder.getNameGroup()).to.be.deep.equal([
            "Brandon", "Mariah"
        ]);
    });

    it("deletes from Objects", function () {
        GroupHolder.deleteAge("Josh");
        chai.expect(GroupHolder.getAgeGroup()).to.be.deep.equal({
            "Brandon": 20,
            "Mariah": 21
        });
    });
});

describe("set", function () {
    it("sets Arrays", function () {
        GroupHolder.setNameGroup(["Josh"]);
        chai.expect(GroupHolder.getNameGroup()).to.be.deep.equal([
            "Josh"
        ]);
    });

    it("sets Objects", function () {
        GroupHolder.setAgeGroup({
            "Josh": 19
        });
        chai.expect(GroupHolder.getAgeGroup()).to.be.deep.equal({
            "Josh": 19
        });
    });
});