import { createFullScreenSaverInterface } from "./index";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("game")!;

createFullScreenSaverInterface(container).catch((error: Error): void => {
    console.error("An error happened while trying to instantiate FullScreenSaver!");
    console.error("requirejs error:", error);
});
