import { expect } from "chai";

import { member, factory } from "./index";

describe("container", () => {
    it("resolves a member dependency", () => {
        // Arrange
        class Dependency {}

        class Container {
            @member(Dependency)
            public readonly dependency: Dependency;
        }

        // Act
        const { dependency } = new Container();

        // Assert
        expect(dependency).to.be.instanceOf(Dependency);
    });

    it("resolves a member dependency to the same instance when accessed multiple times on the same container", () => {
        // Arrange
        class Dependency {}

        class Container {
            @member(Dependency)
            public readonly dependency: Dependency;
        }

        const container = new Container();

        // Act
        const first = container.dependency;
        const second = container.dependency;

        // Assert
        expect(first).to.be.equal(second);
    });

    it("creates different instances of members for different class instances", () => {
        // Arrange
        class Dependency {}

        class Container {
            @member(Dependency)
            public readonly dependency: Dependency;
        }

        // Act
        const first = new Container().dependency;
        const second = new Container().dependency;

        // Assert
        expect(first).to.not.be.equal(second);
    });

    it("resolves two member dependencies out of alphabetical order", () => {
        // Arrange
        class DependencyA {}
        class DependencyB {}

        class Container {
            @member(DependencyB)
            public readonly dependencyB: DependencyB;

            @member(DependencyA)
            public readonly dependencyA: DependencyA;
        }

        // Act
        const { dependencyA, dependencyB } = new Container();

        // Assert
        expect(dependencyA).to.be.instanceOf(DependencyA);
        expect(dependencyB).to.be.instanceOf(DependencyB);
    });

    it("allows access to created members in class constructors", () => {
        // Arrange
        class Dependency {}
        let internal: Dependency | undefined;

        class Container {
            @member(Dependency)
            public readonly dependency: Dependency;

            public constructor() {
                internal = this.dependency;
            }
        }

        // Act
        const { dependency } = new Container();

        // Assert
        expect(internal).to.be.equal(dependency);
    });

    it("allows child classes to access parent values", () => {
        // Arrange
        class Dependency {}

        class ParentContainer {
            @member(Dependency)
            public readonly dependencyA: Dependency;
        }

        class ChildContainer extends ParentContainer {}

        // Act
        const { dependencyA } = new ChildContainer();

        // Assert
        expect(dependencyA).to.be.instanceOf(Dependency);
    });

    it("overrides parent class members with child members under the same name", () => {
        // Arrange
        class ChildDependency {}
        class ParentDependency {}

        class ParentContainer {
            @member(ParentDependency)
            public readonly dependency: ParentDependency;
        }

        class ChildContainer extends ParentContainer {
            @member(ChildDependency)
            public readonly dependency: ChildDependency;
        }

        // Act
        const { dependency } = new ChildContainer();

        // Assert
        expect(dependency).to.be.instanceOf(ChildDependency);
    });

    it("allows child members to declare their own sub-members", () => {
        // Arrange
        class GrandChild {}

        class Child {
            @member(GrandChild)
            public readonly grandChild: GrandChild;
        }

        class Parent {
            @member(Child)
            public readonly child: Child;
        }

        // Act
        const { grandChild } = new Parent().child;

        // Assert
        expect(grandChild).to.be.instanceOf(GrandChild);
    });
});

describe("factory", () => {
    it("creates a member using a factory", () => {
        // Arrange
        class Dependency {
            public constructor(public readonly member: string) {}
        }
        const memberValue = "memberValue";
        const createDependency = () => new Dependency(memberValue);

        class Container {
            @factory(createDependency)
            public readonly dependency: Dependency;
        }

        // Act
        const { dependency } = new Container();

        // Assert
        expect(dependency.member).to.be.equal(memberValue);
    });

    it("creates different members using factories and their naming classes", () => {
        // Arrange
        class DependencyA {
            public constructor(public readonly memberA: string) {}
        }
        class DependencyB {
            public constructor(public readonly memberB: string) {}
        }
        const memberValueA = "memberValueA";
        const memberValueB = "memberValueB";
        const createDependencyA = () => new DependencyA(memberValueA);
        const createDependencyB = () => new DependencyB(memberValueB);

        class Container {
            @factory(createDependencyA)
            public readonly dependencyA: DependencyA;

            @factory(createDependencyB)
            public readonly dependencyB: DependencyB;
        }

        // Act
        const { dependencyA, dependencyB } = new Container();

        // Assert
        expect(dependencyA.memberA).to.be.equal(memberValueA);
        expect(dependencyB.memberB).to.be.equal(memberValueB);
    });

    it("passes the container after creating getters to factories", () => {
        // Arrange
        class DependencyA {
            public constructor(public readonly memberA: string) {}
        }
        class DependencyB {
            public constructor(
                public readonly referenceA: DependencyA,
                public readonly valueC: string
            ) {}
        }
        const memberValueA = "memberValueA";
        const createDependencyA = () => new DependencyA(memberValueA);
        const createDependencyB = (instance: Container) =>
            new DependencyB(dependencyA, instance.valueC);

        class Container {
            @factory(createDependencyA)
            public readonly dependencyA: DependencyA;

            @factory(createDependencyB)
            public readonly dependencyB: DependencyB;

            public readonly valueC: string;
        }

        // Act
        const { dependencyA, dependencyB } = new Container();

        // Assert
        expect(dependencyA.memberA).to.be.equal(memberValueA);
        expect(dependencyB.referenceA).to.be.equal(dependencyA);
    });
});
