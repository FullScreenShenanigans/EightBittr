describe("addEventIntervalSynched", function () {
    before(function () {
        sinon.stub(TimeHandlr.TimeHandlr.prototype, "addEventInterval");
    });

    after(function () {
        TimeHandlr.TimeHandlr.prototype.addEventInterval.restore();
    });

    it("calls addEventInterval immediately if time is equal in modularity", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy();

        // Act
        TimeHandler.addEventIntervalSynched(spy, 3);

        // Assert
        chai.assert(TimeHandlr.TimeHandlr.prototype.addEventInterval.calledWith(spy));
    });

    it("delays addEventInterval if time is different in modularity", function () {
        // Arrange
        var TimeHandler = new TimeHandlr.TimeHandlr(),
            spy = sinon.spy(),
            delay = 3,
                i;

        // Act
        TimeHandler.handleEvents();
        TimeHandler.addEventIntervalSynched(spy, delay);

        // Assert
        chai.assert(!TimeHandlr.TimeHandlr.prototype.addEventInterval.calledWith(spy));
        for (i = 0; i < delay - 1; i += 1) {
            TimeHandler.handleEvents();
        }
        chai.assert(TimeHandlr.TimeHandlr.prototype.addEventInterval.calledWith(spy));
    });
});