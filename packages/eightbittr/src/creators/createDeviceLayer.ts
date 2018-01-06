import { DeviceLayr } from "devicelayr";

import { GameStartr } from "../GameStartr";

export const createDeviceLayer = (gameStarter: GameStartr) =>
    new DeviceLayr({
        inputWriter: gameStarter.inputWriter,
        ...gameStarter.settings.components.devices,
    });
