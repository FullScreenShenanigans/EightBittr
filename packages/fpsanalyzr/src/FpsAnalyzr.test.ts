import { expect } from "chai";

import { stubFpsAnalyzr } from "./fakes.test";

describe("FPSAnalyzr", () => {
    describe("getAverage", () => {
        it("returns 0 when no ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer } = stubFpsAnalyzr();

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(0);
        });

        it("returns 0 when one tick has been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(1);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(0);
        });

        it("returns an average of one when one tick happens per second", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(1000);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(1);
        });

        it("returns an average of one when two ticks happen per two seconds", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(1000);
            tick(2000);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(1);
        });

        it("returns an average of two when two ticks happen per second", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(500);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(2);
        });

        it("returns an average of two when four ticks happen per two seconds", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(500);
            tick(1000);
            tick(1500);
            tick(2000);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(2);
        });

        it("returns an average of three when nine ticks happen per three seconds", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(333);
            tick(999);
            tick(1200);
            tick(1500);
            tick(1800);
            tick(2100);
            tick(2500);
            tick(3000);

            // Act
            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.approximately(3, 0.01);
        });
    });

    describe("getExtremes", () => {
        it("returns zeroes when no ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer } = stubFpsAnalyzr();

            // Act
            const extremes = fpsAnalyzer.getExtremes();

            // Assert
            expect(extremes).to.be.deep.equal({
                highest: 0,
                lowest: 0,
            });
        });

        it("returns zeroes when one tick has been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(1);

            // Act
            const extremes = fpsAnalyzer.getExtremes();

            // Assert
            expect(extremes).to.be.deep.equal({
                highest: 0,
                lowest: 0,
            });
        });

        it("returns the same number when two ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(500);

            // Act
            const extremes = fpsAnalyzer.getExtremes();

            // Assert
            expect(extremes).to.be.deep.equal({
                highest: 2,
                lowest: 2,
            });
        });
    });

    describe("getMedian", () => {
        it("returns zero when no ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer } = stubFpsAnalyzr();

            // Act
            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.equal(0);
        });

        it("returns zero when one tick has been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(1);

            // Act
            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.equal(0);
        });

        it("returns the single measurement when two ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(1000);

            // Act
            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.equal(1);
        });

        it("returns the average of two measurements when three ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(1000);
            tick(1500);

            // Act
            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.equal(1.5);
        });

        it("returns the middle of three measurements when four ticks have been recorded", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            tick(0);
            tick(1000);
            tick(1500);
            tick(1750);

            // Act
            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.equal(2);
        });
    });

    describe("maximumKept", () => {
        it("defaults to 250 ticks", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr();

            // Act
            for (let i = 0; i < 300; i += 1) {
                tick(i * i);
            }

            const median = fpsAnalyzer.getMedian();

            // Assert
            expect(median).to.be.approximately(2.857, 0.001);
        });

        it("overrides maximumKept when provided", () => {
            // Arrange
            const { fpsAnalyzer, tick } = stubFpsAnalyzr({
                maximumKept: 2,
            });

            // Act
            tick(0);
            tick(1500);
            tick(2000);
            tick(2500);

            const average = fpsAnalyzer.getAverage();

            // Assert
            expect(average).to.be.equal(2);
        });
    });
});
