import { expect } from "chai";
import * as sinon from "sinon";

import { stubGroupHoldr } from "./fakes.test";
import { Actor } from "./types";

describe("GroupHoldr", () => {
    describe("addToGroup", () => {
        it("adds a Actor to a group when given a group name", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(actor, "test");

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([actor]);
        });

        it("doesn't add a Actor to a wrong group when multiple groups exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: Actor; def: Actor }>(["abc", "def"]);
            const actor: Actor = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(actor, "abc");

            // Assert
            expect(groupHolder.getGroup("def")).to.be.deep.equal([]);
        });

        it("registers a actor under actorsById when id exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor = {
                id: "a",
            };

            // Act
            groupHolder.addToGroup(actor, "test");

            // Assert
            expect(groupHolder.getActor(actor.id)).to.be.equal(actor);
        });

        it("throws an error when the group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr();
            const actor: Actor = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.addToGroup(actor, "abc");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });
    });

    describe("clear", () => {
        it("does noactor when no Actors have been added", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.deep.equal([]);
        });

        it("removes a Actor from its group when one exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([]);
        });

        it("removes a Actor by ID when id exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getActor(actor.id)).to.be.equal(undefined);
        });

        it("removes all Actors from their groups when multiple exist across groups", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc", "def"]);
            const abc = [{ id: "1" }, { id: "2" }];
            const def = [{ id: "3" }, { id: "4" }];

            for (const actor of abc) {
                groupHolder.addToGroup(actor, "abc");
            }

            for (const actor of def) {
                groupHolder.addToGroup(actor, "def");
            }

            // Act
            groupHolder.clear();

            // Assert
            for (const actor of [...abc, ...def]) {
                expect(groupHolder.getActor(actor.id)).to.be.equal(undefined);
            }
        });

        it("keeps arrays at the same object reference", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            const oldGroup = groupHolder.getGroup("test");

            // Act
            groupHolder.clear();

            // Assert
            expect(groupHolder.getGroup("test")).to.be.equal(oldGroup);
        });
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

        it("doesn't throw an error if no Actors have been added", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["test"]);

            // Act
            const action = (): void => {
                groupHolder.callOnAll(sinon.stub());
            };

            // Assert
            expect(action).not.to.throw();
        });

        it("runs the action on a single Actor when one group contains just the Actor", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor = {
                id: "1",
            };
            const action = sinon.stub();

            groupHolder.addToGroup(actor, "abc");

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            expect(action).to.have.been.calledWithExactly(actor);
            expect(action).to.have.callCount(1);
        });

        it("runs the action on two Actors when two groups contains a Actor each", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc", "def"]);
            const actors = [
                {
                    id: "1",
                },
                {
                    id: "2",
                },
            ];
            const action = sinon.stub();

            groupHolder.addToGroup(actors[0], "abc");
            groupHolder.addToGroup(actors[1], "def");

            // Act
            groupHolder.callOnAll(action);

            // Assert
            for (const actor of actors) {
                expect(action).to.have.been.calledWithExactly(actor);
            }

            expect(action).to.have.callCount(actors.length);
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

        it("runs the action on a single Actor when the group contains just the Actor", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor = {
                id: "1",
            };
            const action = sinon.stub();

            groupHolder.addToGroup(actor, "abc");

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            expect(action).to.have.been.calledWithExactly(actor);
            expect(action).to.have.callCount(1);
        });

        it("runs the action on two Actors when the group contains the two Actors", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actors = [
                {
                    id: "1",
                },
                {
                    id: "2",
                },
            ];
            const action = sinon.stub();

            for (const actor of actors) {
                groupHolder.addToGroup(actor, "abc");
            }

            // Act
            groupHolder.callOnGroup("abc", action);

            // Assert
            for (const actor of actors) {
                expect(action).to.have.been.calledWithExactly(actor);
            }

            expect(action).to.have.callCount(actors.length);
        });
    });

    describe("getGroup", () => {
        it("gets a group when the group name exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            const group = groupHolder.getGroup("abc");

            // Assert
            expect(group).to.be.deep.equal([actor]);
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

    describe("getActor", () => {
        it("gets a Actor by id when the Actor exists", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            const retrieved = groupHolder.getActor("a");

            // Assert
            expect(retrieved).to.be.equal(actor);
        });

        it("returns undefined when given an ID that doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            const retrieved = groupHolder.getActor("b");

            // Assert
            expect(retrieved).to.be.equal(undefined);
        });
    });

    describe("removeFromGroup", () => {
        it("removes a Actor from a group when the Actor exists in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            groupHolder.removeFromGroup(actor, "test");

            // Assert
            expect(groupHolder.getGroup("test")).to.be.deep.equal([]);
        });

        it("returns true when it removes a Actor from a group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            const result = groupHolder.removeFromGroup(actor, "test");

            // Assert
            expect(result).to.be.equal(true);
        });

        it("doesn't modify a group when removing a Actor that doesn't exist in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            groupHolder.removeFromGroup({ id: "b" }, "test");

            // Assert
            const group = groupHolder.getGroup("test");
            expect(group).to.be.deep.equal([actor]);
        });

        it("returns false when removing a Actor that doesn't exist in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            const result = groupHolder.removeFromGroup({ id: "b" }, "test");

            // Assert
            expect(result).to.be.equal(false);
        });

        it("removes the Actor from the ID listing when it exists in the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ test: Actor }>(["test"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "test");

            // Act
            groupHolder.removeFromGroup({ id: "a" }, "test");
            const retrieved = groupHolder.getActor("a");

            // Assert
            expect(retrieved).to.be.equal(undefined);
        });

        it("removes the Actor from the ID listing when it exists in a different group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: Actor; def: Actor }>(["abc", "def"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            groupHolder.removeFromGroup({ id: "a" }, "def");
            const retrieved = groupHolder.getActor("a");

            // Assert
            expect(retrieved).to.be.equal(undefined);
        });

        it("throws an error when the group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);
            const actor: Actor = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.removeFromGroup(actor, "abc");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });
    });

    describe("switchGroup", () => {
        it("removes a Actor from its old group when it's a member of the group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: Actor; def: Actor }>(["abc", "def"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            groupHolder.switchGroup(actor, "abc", "def");

            // Assert
            expect(groupHolder.getGroup("abc")).to.be.deep.equal([]);
        });

        it("adds a Actor to a new group", () => {
            // Arrange
            const groupHolder = stubGroupHoldr<{ abc: Actor; def: Actor }>(["abc", "def"]);
            const actor: Actor = {
                id: "a",
            };

            groupHolder.addToGroup(actor, "abc");

            // Act
            groupHolder.switchGroup(actor, "abc", "def");

            // Assert
            expect(groupHolder.getGroup("def")).to.be.deep.equal([actor]);
        });

        it("throws an error when the old group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["def"]);
            const actor: Actor = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.switchGroup(actor, "abc", "def");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'abc'.");
        });

        it("throws an error when the new group name doesn't exist", () => {
            // Arrange
            const groupHolder = stubGroupHoldr(["abc"]);
            const actor: Actor = {
                id: "a",
            };

            // Act
            const action = (): void => {
                groupHolder.switchGroup(actor, "abc", "def");
            };

            // Assert
            expect(action).to.throw("Unknown group: 'def'.");
        });
    });
});
