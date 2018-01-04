import { expect } from "chai";

import { component } from "./Component";
import { container } from "./Container";

// tslint:disable completed-docs no-use-before-declare

describe("container", () => {
    it("resolves a component dependency", () => {
        // Arrange
        class DependencyA { }

        @container
        class Container {
            @component(DependencyA)
            public readonly dependencyA: DependencyA;
        }

        // Act
        const { dependencyA } = new Container();

        // Assert
        expect(dependencyA).to.be.instanceOf(DependencyA);
    });

    it("resolves two component dependencies out of alphabetical order", () => {
        // Arrange
        class DependencyA { }
        class DependencyB { }

        @container
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
        class DependencyA {
            public constructor(
                public readonly member: string,
            ) { }
        }
        const memberValue = "memberValue";
        const createDependencyA = () => new DependencyA(memberValue);

        @container
        class Container {
            @component(createDependencyA, DependencyA)
            public readonly dependencyA: DependencyA;
        }

        // Act
        const { dependencyA } = new Container();

        // Assert
        expect(dependencyA.member).to.be.equal(memberValue);
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

        @container
        class Container {
            @component(createDependencyA, DependencyA)
            public readonly dependencyA: DependencyA;

            @component(createDependencyB, DependencyB)
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

        @container
        class Container {
            @component(createDependencyA, DependencyA)
            public readonly dependencyA: DependencyA;

            @component(createDependencyB, DependencyB)
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
