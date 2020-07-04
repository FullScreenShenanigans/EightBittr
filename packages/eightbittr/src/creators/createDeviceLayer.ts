import { DeviceLayr } from "devicelayr";

import { EightBittr } from "../EightBittr";

export const createDeviceLayer = (game: EightBittr) =>
    new DeviceLayr({
        inputWriter: game.inputWriter,
        ...game.settings.components.deviceLayer,
    });
