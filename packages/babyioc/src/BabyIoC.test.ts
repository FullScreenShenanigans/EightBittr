import { expect } from "chai";

import { component } from "./index";

// tslint:disable completed-docs no-use-before-declare

describe("container", () => {
    it("resolves a component dependency", () => {
        // Arrange
        class Dependency { }

        class Container {
            @component(Dependency)
            public readonly dependency: Dependency;
        }

        // Act
        const { dependency } = new Container();

        // Assert
        expect(dependency).to.be.instanceOf(Dependency);
    });

    it("resolves a component dependency to the same instance when accessed multiple times on the same container", () => {
        // Arrange
        class Dependency { }

        class Container {
            @component(Dependency)
            public readonly dependency: Dependency;
        }

        const container = new Container();

        // Act
        const first = container.dependency;
        const second = container.dependency;

        // Assert
        expect(first).to.be.equal(second);
    });

    it("creates different instances of components for different class instances", () => {
        // Arrange
        class Dependency { }

        class Container {
            @component(Dependency)
            public readonly dependency: Dependency;
        }

        // Act
        const first = new Container().dependency;
        const second = new Container().dependency;

        // Assert
        expect(first).to.not.be.equal(second);
    });

    it("resolves two component dependencies out of alphabetical order", () => {
        // Arrange
        class DependencyA { }
        class DependencyB { }

        class Container {
            @component(DependencyB)
            public readonly dependencyB: DependencyB;

            @component(DependencyA)
            public readonly dependencyA: DependencyA;
        }

        // Act
        const { dependencyA, dependencyB } = new Container();

        // Assert
        expect(dependencyA).to.be.instanceOf(DependencyA);
        expect(dependencyB).to.be.instanceOf(DependencyB);
    });

    it("creates a component using a factory", () => {
        // Arrange
        class Dependency {
            public constructor(
                public readonly member: string,
            ) { }
        }
        const memberValue = "memberValue";
        const createDependency = () => new Dependency(memberValue);

        class Container {
            @component(createDependency)
            public readonly dependency: Dependency;
        }

        // Act
        const { dependency } = new Container();

        // Assert
        expect(dependency.member).to.be.equal(memberValue);
    });

    it("creates different components using factories and their naming classes", () => {
        // Arrange
        class DependencyA {
            public constructor(
                public readonly memberA: string,
            ) { }
        }
        class DependencyB {
            public constructor(
                public readonly memberB: string,
            ) { }
        }
        const memberValueA = "memberValueA";
        const memberValueB = "memberValueB";
        const createDependencyA = () => new DependencyA(memberValueA);
        const createDependencyB = () => new DependencyB(memberValueB);

        class Container {
            @component(createDependencyA)
            public readonly dependencyA: DependencyA;

            @component(createDependencyB)
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
            public constructor(
                public readonly memberA: string,
            ) { }
        }
        class DependencyB {
            public constructor(
                public readonly referenceA: DependencyA,
                public readonly valueC: string,
            ) { }
        }
        const memberValueA = "memberValueA";
        const createDependencyA = () => new DependencyA(memberValueA);
        const createDependencyB = (instance: Container) => new DependencyB(dependencyA, instance.valueC);

        class Container {
            @component(createDependencyA)
            public readonly dependencyA: DependencyA;

            @component(createDependencyB)
            public readonly dependencyB: DependencyB;

            public readonly valueC: string;
        }

        // Act
        const { dependencyA, dependencyB } = new Container();

        // Assert
        expect(dependencyA.memberA).to.be.equal(memberValueA);
        expect(dependencyB.referenceA).to.be.equal(dependencyA);
    });

    it("allows access to created components in class constructors", () => {
        // Arrange
        class Dependency { }
        let internal: Dependency | undefined;

        class Container {
            @component(Dependency)
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
        class Dependency { }

        class ParentContainer {
            @component(Dependency)
            public readonly dependencyA: Dependency;
        }

        class ChildContainer extends ParentContainer { }

        // Act
        const { dependencyA } = new ChildContainer();

        // Assert
        expect(dependencyA).to.be.instanceOf(Dependency);
    });

    it("overrides parent class components with child components under the same name", () => {
        // Arrange
        class ChildDependency { }
        class ParentDependency { }

        class ParentContainer {
            @component(ParentDependency)
            public readonly dependency: ParentDependency;
        }

        class ChildContainer extends ParentContainer {
            @component(ChildDependency)
            public readonly dependency: ChildDependency;
        }

        // Act
        const { dependency } = new ChildContainer();

        // Assert
        expect(dependency).to.be.instanceOf(ChildDependency);
    });

    it("allows child components to declare their own sub-components", () => {
        // Arrange
        class GrandChild { }

        class Child {
            @component(GrandChild)
            public readonly grandChild: GrandChild;
        }

        class Parent {
            @component(Child)
            public readonly child: Child;
        }

        // Act
        const { grandChild } = new Parent().child;

        // Assert
        expect(grandChild).to.be.instanceOf(GrandChild);
    });
});
