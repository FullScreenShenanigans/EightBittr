import { expect } from "chai";
import * as sinon from "sinon";

import { stubGroupHoldr } from "./fakes.test";
import { IThing } from "./IGroupHoldr";

describe("GroupHoldr", () => {
    describe("addToGroup", () => {
        it("adds a Thing to a group when given a group name", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(thing, "test");

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([thing]);
        });

        it("doesn't add a Thing to a wrong group when multiple groups exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: IThing; def: IThing }>(["abc", "def"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(thing, "abc");

            // Assert
            expect(groupHolder.getGroup("def")).to.be.deep.equal([]);
        });

        it("registers a thing under thingsById when added", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(thing, "test");

            // Assert
            expect(groupHolder.getThing(thing.id)).to.be.equal(thing);
        });

        it("throws an error when the group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr();
            const thing: IThing = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.addToGroup(thing, "abc");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });
    });

    describe("clear", () => {
        it("does nothing when no Things have been added", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.deep.equal([]);
        });

        it("removes a Thing from its group when one exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([]);
        });

        it("removes a Thing by ID when one exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getThing(thing.id)).to.be.equal(undefined);
        });

        it("removes all Things from their groups when multiple exist across groups", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc", "def"]);
            const abc = [
                { id: "1" },
                { id: "2" },
            ];
            const def = [
                { id: "3" },
                { id: "4" },
            ];

            for (const thing of abc) {
                groupHolder.addToGroup(thing, "abc");
            }

            for (const thing of def) {
                groupHolder.addToGroup(thing, "def");
            }

            // Act
            groupHolder.clear();

            // Assert
            for (const thing of [...abc, ...def]) {
                expect(groupHolder.getThing(thing.id)).to.be.equal(undefined);
            }
        });

        it("keeps arrays at the same object reference", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            const oldGroup = groupHolder.getGroup("test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.be.equal(oldGroup);
        })
    });

    describe("callOnAll", () => {
        it("doesn't throw an error if no groups exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr();

            // Act
            const action = (): void => {
                groupHolder.callOnAll(sinon.stub());
            };

            // Assert
            expect(action).not.to.throw();
        });

        it("doesn't throw an error if no Things have been added", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["test"]);

            // Act
            const action = (): void => {
                groupHolder.callOnAll(sinon.stub());
            };

            // Assert
            expect(action).not.to.throw();
        });

        it("runs the action on a single Thing when one group contains just the Thing", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing = {
                id: "1",
            };
            const action = sinon.stub();

            groupHolder.addToGroup(thing, "abc");

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            expect(action).to.have.been.calledWithExactly(thing);
            expect(action).to.have.callCount(1);
        });

        it("runs the action on two Things when two groups contains a Thing each", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc", "def"]);
            const things = [
                {
                    id: "1",
                },
                {
                    id: "2",
                },
            ];
            const action = sinon.stub();

            groupHolder.addToGroup(things[0], "abc");
            groupHolder.addToGroup(things[1], "def");

            // Act
            groupHolder.callOnAll(action);

            // Assert
            for (const thing of things) {
                expect(action).to.have.been.calledWithExactly(thing);
            }

            expect(action).to.have.callCount(things.length);
        });
    });

    describe("callOnGroup", () => {
        it("throws an error if the group doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);

            // Act
            const action = (): void => {
                groupHolder.callOnGroup("abc", sinon.stub());
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });

        it("runs the action on a single Thing when the group contains just the Thing", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing = {
                id: "1",
            };
            const action = sinon.stub();

            groupHolder.addToGroup(thing, "abc");

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            expect(action).to.have.been.calledWithExactly(thing);
            expect(action).to.have.callCount(1);
        });

        it("runs the action on two Things when the group contains the two Things", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const things = [
                {
                    id: "1",
                },
                {
                    id: "2",
                },
            ];
            const action = sinon.stub();

            for (const thing of things) {
                groupHolder.addToGroup(thing, "abc");
            }

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            for (const thing of things) {
                expect(action).to.have.been.calledWithExactly(thing);
            }

            expect(action).to.have.callCount(things.length);
        });
    });

    describe("getGroup", () => {
        it("gets a group when the group name exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "abc");

            // Act
            const group = groupHolder.getGroup("abc");

            // Assert
            expect(group).to.be.deep.equal([thing]);
        });

        it("throws an error when the group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);

            // Act
            const action = (): void => {
                groupHolder.getGroup("abc");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });
    });

    describe("getThing", () => {
        it("gets a Thing by id when the Thing exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "abc");

            // Act
            const retrieved = groupHolder.getThing("a");

            // Assert
            expect(retrieved).to.be.equal(thing);
        });

        it("returns undefined when given an ID that doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "abc");

            // Act
            const retrieved = groupHolder.getThing("b");

            // Assert
            expect(retrieved).to.be.equal(undefined);
        });
    });

    describe("removeFromGroup", () => {
        it("removes a Thing from a group when the Thing exists in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            groupHolder.removeFromGroup(thing, "test");

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([]);
        });

        it("returns true when it removes a Thing from a group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            const result = groupHolder.removeFromGroup(thing, "test");

            // Assert
            expect(result).to.be.equal(true);
        });

        it("doesn't modify a group when removing a Thing that doesn't exist in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            groupHolder.removeFromGroup({ id: "b" }, "test");

            // Assert
            const group = groupHolder.getGroup("test");
            expect(group).to.be.deep.equal([thing]);
        });

        it("returns false when removing a Thing that doesn't exist in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: IThing }>(["test"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "test");

            // Act
            const result = groupHolder.removeFromGroup({ id: "b" }, "test");

            // Assert
            expect(result).to.be.equal(false);
        });

        it("throws an error when the group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.removeFromGroup(thing, "abc");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });
    });

    describe("switchGroup", () => {
        it("removes a Thing from its old group when it's a member of the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: IThing; def: IThing }>(["abc", "def"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "abc");

            // Act
            groupHolder.switchGroup(thing, "abc", "def");

            // Assert
            expect(groupHolder.getGroup("abc")).to.be.deep.equal([]);
        });

        it("adds a Thing to a new group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: IThing; def: IThing }>(["abc", "def"]);
            const thing: IThing = {
                id: "a",
            };

            groupHolder.addToGroup(thing, "abc");

            // Act
            groupHolder.switchGroup(thing, "abc", "def");

            // Assert
            expect(groupHolder.getGroup("def")).to.be.deep.equal([thing]);
        });

        it("throws an error when the old group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.switchGroup(thing, "abc", "def");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });

        it("throws an error when the new group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const thing: IThing = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.switchGroup(thing, "abc", "def");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'def'.");
        });
    });
});
