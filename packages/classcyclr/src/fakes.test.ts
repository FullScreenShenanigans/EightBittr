import { TimeHandlr } from "timehandlr";

import { ClassCyclr } from "./ClassCyclr";
import { Actor } from "./types";

export const createClassCycler = () => {
    const timeHandler = new TimeHandlr();
    const classCycler = new ClassCyclr({ timeHandler });

    return { classCycler, timeHandler };
};

export const createStubActor = (overrides?: Partial<Actor>) => ({
    className: "",
    placed: true,
    ...overrides,
});
