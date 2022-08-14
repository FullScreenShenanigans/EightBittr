import { createFullScreenSaverInterface } from "./index";

const container = document.getElementById("game")!;

createFullScreenSaverInterface(container).catch((error: Error): void => {
    console.error("An error happened while trying to instantiate FullScreenSaver!");
    console.error("requirejs error:", error);
});
