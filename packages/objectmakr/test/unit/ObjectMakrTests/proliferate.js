define(["mocks"], function (mocks) {
    return function () {
        var expect = require("chai").expect;

        it("adds shallow properties to a recipient", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var recipient = {};
            var donor = {
                foo: true,
                bar: false
            };

            // Act
            objectMaker.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
            expect(donor.bar).to.be.equal(recipient.bar);
        });

        it("adds deep copied objects to a recipient", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var recipient = {};
            var donor = {
                foo: {
                    bar: true
                }
            };

            // Act
            objectMaker.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("adds deep copied arrays to a recipient", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var recipient = {};
            var donor = {
                foo: [1, 2, 3]
            };

            // Act
            objectMaker.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.deep.equal(recipient.foo);
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });

        it("overrides existing properties", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var recipient = {
                foo: false
            };
            var donor = {
                foo: true
            };

            // Act
            objectMaker.proliferate(recipient, donor);

            // Assert
            expect(donor.foo).to.be.equal(recipient.foo);
        });

        it("doesn't override existing properties when noOverrides is true", function () {
            // Arrange
            var objectMaker = mocks.mockObjectMakr();
            var recipient = {
                foo: false
            };
            var donor = {
                foo: true
            };

            // Act
            objectMaker.proliferate(recipient, donor, true);

            // Assert
            expect(donor.foo).to.not.be.equal(recipient.foo);
        });
    };
});