import { AudioSettingsStorage } from "./types";

export const wrapNativeStorage = (storage: Storage): AudioSettingsStorage => ({
    getMuted: () => !!JSON.parse(storage.getItem("muted") ?? "false"),
    getVolume: () => JSON.parse(storage.getItem("volume") ?? "1") ?? 1,
    setMuted: (value: boolean) => storage.setItem("muted", JSON.stringify(value)),
    setVolume: (value: number) => storage.setItem("volume", JSON.stringify(value)),
});
