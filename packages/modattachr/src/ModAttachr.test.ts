import { expect } from "chai";

import { EventNames } from "./EventNames";
import { FakeEventNames } from "./fakes.test";
import { ModAttachr } from "./ModAttachr";

it("onModEnable is fired when a mod is enabled", (): void => {
    // Arrange
    const eventNames = new EventNames();
    const mod = {
        name: "Dummy Mod",
        events: {
            [eventNames.onModEnable]: (): string => "success",
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [mod],
        eventNames,
    });

    // Act
    const eventResult: string = modAttachr.fireModEvent(eventNames.onModEnable, mod.name);

    // Assert
    expect(eventResult).to.be.equal("success");
});

it("onModDisable is fired when a mod is disabled", (): void => {
    // Arrange
    const eventNames = new EventNames();
    const mod = {
        name: "Dummy Mod",
        events: {
            [eventNames.onModDisable]: (): string => "success",
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [mod],
        eventNames,
    });

    // Act
    const eventResult: string = modAttachr.fireModEvent(eventNames.onModDisable, mod.name);

    // Assert
    expect(eventResult).to.be.equal("success");
});

it("an arbitrary event is fired", (): void => {
    // Arrange
    const value = 42;
    const eventNames = new FakeEventNames();
    const mod = {
        name: "Dummy Fake Mod",
        events: {
            [eventNames.fakeEvent]: (): number => value,
        },
        enabled: false,
    };
    const modAttachr = new ModAttachr({
        mods: [mod],
        eventNames,
    });

    // Act
    const eventResult: number = modAttachr.fireModEvent(eventNames.fakeEvent, mod.name);

    // Assert
    expect(eventResult).to.be.equal(value);
});
