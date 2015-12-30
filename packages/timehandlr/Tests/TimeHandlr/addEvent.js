describe("addEvent", function () {
    it("plays an event without a timeDelay", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy();

        // Act
        TimeHandler.addEvent(spy);
        TimeHandler.handleEvents();

        // Assert
        chai.expect(spy.calledOnce);
    });

    it("plays an event with a timeDelay", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy(),
            delay = 7,
            i;

        // Act
        TimeHandler.addEvent(spy, delay);
        for (i = 0; i < delay - 1; i += 1) {
            TimeHandler.handleEvents();
            chai.expect(spy.calledOnce).to.be.false;
        }

        // Assert
        TimeHandler.handleEvents();
        chai.expect(spy.calledOnce).to.be.true;
    });

    it("does not pass arguments when not given", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy();

        // Act
        TimeHandler.addEvent(spy, 0);
        TimeHandler.handleEvents();

        // Assert
        chai.assert(spy.calledWithExactly());
    });

    it("passes arguments when given", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy();

        // Act
        TimeHandler.addEvent(spy, 0, "a", "b", "c");
        TimeHandler.handleEvents();

        // Assert
        chai.assert(spy.calledWithExactly("a", "b", "c"));
    });
});