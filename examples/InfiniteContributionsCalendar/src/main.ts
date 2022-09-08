import { createInfiniteContributionsCalendarInterface } from "./index";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const container = document.getElementById("game")!;

createInfiniteContributionsCalendarInterface(container).catch((error: Error): void => {
    console.error("An error happened while trying to instantiate InfiniteContributionsCalendar!");
    console.error("requirejs error:", error);
});
