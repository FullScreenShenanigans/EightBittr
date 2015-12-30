describe("addEventInterval", function () {
    it("plays an event once without timeDelay or numRepeats", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy();

        // Act
        TimeHandler.addEventInterval(spy);
        TimeHandler.handleEvents();

        // Assert
        chai.expect(spy.calledOnce);
        TimeHandler.handleEvents();
        chai.expect(spy.calledOnce);
    });

    it("plays an event once with timeDelay", function () {
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
        TimeHandler.handleEvents();
        chai.expect(spy.calledOnce).to.be.true;
    });

    it("plays an event with timeDelay and numRepeats", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy(),
            delay = 7,
            i, j;

        // Act
        TimeHandler.addEventInterval(spy, delay, 3);
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < delay; j += 1) {
                TimeHandler.handleEvents();
            }
        }

        // Assert
        chai.expect(spy.calledThrice).to.be.true;
    });

    it("does not pass arguments when not given", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy(),
            delay = 7,
            i, j;

        // Act
        TimeHandler.addEventInterval(spy, delay, 3);
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < delay; j += 1) {
                TimeHandler.handleEvents();
            }
        }

        // Assert
        chai.assert(spy.calledWithExactly());
    });

    it("passes arguments when given", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy(),
            delay = 7,
            i, j;

        // Act
        TimeHandler.addEventInterval(spy, delay, 3, "a", "b", "c");
        for (i = 0; i < 3; i += 1) {
            for (j = 0; j < delay; j += 1) {
                TimeHandler.handleEvents();
            }
        }

        // Assert
        chai.assert(spy.calledWithExactly("a", "b", "c"));
    });
});