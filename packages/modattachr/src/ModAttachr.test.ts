import { expect } from "chai";

import { EventNames } from "./EventNames";
import { FakeEventNames } from "./fakes.test";
import { ModAttachr } from "./ModAttachr";

it("Testing to ensure onModEnable is fired properly", (): void => {
    // Arrange
    const eventNames = new EventNames();
    const dummyMod = {
        name: "Dummy Mod",
        events: {
            [eventNames.onModEnable]: (): string => "success",
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [dummyMod],
        eventNames,
    });

    // Act
    const eventResult: string = modAttachr.fireModEvent(eventNames.onModEnable, "Dummy Mod");

    // Assert
    expect(eventResult).to.be.equal("success");
});

it("Testing to ensure onModDisable is fired properly", (): void => {
    // Arrange
    const eventNames = new EventNames();
    const dummyMod = {
        name: "Dummy Mod",
        events: {
            [eventNames.onModDisable]: (): string => "success",
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [dummyMod],
        eventNames,
    });

    // Act
    const eventResult: string = modAttachr.fireModEvent(eventNames.onModDisable, "Dummy Mod");

    // Assert
    expect(eventResult).to.be.equal("success");
});

it("Testing to ensure an arbitrary fake event is fired properly", (): void => {
    // Arrange
    const value = 42;
    const eventNames = new FakeEventNames();
    const dummyMod = {
        name: "Dummy Fake Mod",
        events: {
            [eventNames.fakeEvent]: (): number => value,
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [dummyMod],
        eventNames,
    });

    // Act
    const eventResult: number = modAttachr.fireModEvent(eventNames.fakeEvent, "Dummy Fake Mod");

    // Assert
    expect(eventResult).to.be.equal(value);
});
