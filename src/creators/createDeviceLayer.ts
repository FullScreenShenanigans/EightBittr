import { DeviceLayr } from "devicelayr";

import { EightBittr } from "../EightBittr";

export const createDeviceLayer = (eightBitter: EightBittr) =>
    new DeviceLayr({
        inputWriter: eightBitter.inputWriter,
        ...eightBitter.settings.components.devices,
    });
