import { expect } from "chai";
import * as sinon from "sinon";

import { InputWritr } from "./InputWritr";
import { InputWritrSettings } from "./types";

const createInputWritr = (overrides?: Partial<InputWritrSettings>) => {
    const keyDownLeft = sinon.spy();
    const inputWriter = new InputWritr({
        aliases: {
            keyDownLeft: [65],
        },
        triggers: {
            onkeydown: { keyDownLeft },
        },
        ...overrides,
    });

    return { inputWriter, keyDownLeft };
};

describe("InputWritr", () => {
    describe("callEvent", () => {
        it("does not throw an error when the event type does not exist", () => {
            // Arrange
            const { inputWriter } = createInputWritr();

            // Act
            const act = () => inputWriter.callEvent("onkeyup", 65);

            // Assert
            expect(act).not.to.throw();
        });

        it("does not throw an error when the key code does not exist ", () => {
            // Arrange
            const { inputWriter } = createInputWritr();

            // Act
            const act = () => inputWriter.callEvent("onkeydown", -1);

            // Assert
            expect(act).not.to.throw();
        });

        it("does not trigger the event when canTrigger returns false", () => {
            // Arrange
            const { inputWriter, keyDownLeft } = createInputWritr({
                canTrigger: () => false,
            });

            // Act
            inputWriter.callEvent("keyDownLeft", 65);

            // Assert
            expect(keyDownLeft).to.have.callCount(0);
        });

        it("triggers the event when canTrigger returns true", () => {
            // Arrange
            const { inputWriter, keyDownLeft } = createInputWritr({
                canTrigger: () => true,
            });

            // Act
            inputWriter.callEvent("onkeydown", 65);

            // Assert
            expect(keyDownLeft).to.have.callCount(1);
        });
    });

    describe("createPipe", () => {
        it("throws an error when the event type does not exist", () => {
            // Arrange
            const { inputWriter } = createInputWritr();

            // Act
            const act = () => inputWriter.createPipe("onkeyup", "keyCode");

            // Assert
            expect(act).to.throw(`No trigger of type 'onkeyup' defined.`);
        });

        it("does not call to the piped function when the event code label does not match", () => {
            // Arrange
            const { inputWriter, keyDownLeft } = createInputWritr();

            const pipe = inputWriter.createPipe("onkeydown", "keyCode");
            const event = new KeyboardEvent("onkeydown", { keyCode: -1 });

            // Act
            pipe(event);

            // Assert
            expect(keyDownLeft).to.have.callCount(0);
        });

        it("calls to the piped function when the event type and its code label match", () => {
            // Arrange
            const { keyDownLeft, inputWriter } = createInputWritr();

            const pipe = inputWriter.createPipe("onkeydown", "keyCode");
            const event = new KeyboardEvent("onkeydown", { keyCode: 65 });

            // Act
            pipe(event);

            // Assert
            expect(keyDownLeft).to.have.been.calledWith(event);
        });

        it("it does not call preventDefault when preventDefault is false", () => {
            // Arrange
            const { inputWriter } = createInputWritr();

            const pipe = inputWriter.createPipe("onkeydown", "keyCode", false);
            const event = new KeyboardEvent("onkeydown", { keyCode: 65 });
            event.preventDefault = sinon.spy();

            // Act
            pipe(event);

            // Assert
            expect(event.preventDefault).to.have.callCount(0);
        });

        it("it calls preventDefault when preventDefault is true", () => {
            // Arrange
            const { inputWriter } = createInputWritr();

            const pipe = inputWriter.createPipe("onkeydown", "keyCode", true);
            const event = new KeyboardEvent("onkeydown", { keyCode: 65 });
            event.preventDefault = sinon.spy();

            // Act
            pipe(event);

            // Assert
            expect(event.preventDefault).to.have.callCount(1);
        });
    });
});
