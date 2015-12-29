declare module TimeHandlr {
    export interface IEventCallback {
        (...args: any[]): any;
        event?: IEvent;
    }

    export interface IEventsContainer {
        [i: string]: [IEvent];
        [i: number]: [IEvent];
    }

    export interface ITimeCycle {
        length: number;
        event: any;
    }

    export interface ITimeCycles {
        [i: string]: ITimeCycle;
    }

    export interface IClassChanger {
        (thing: any, className: string): void;
    }

    export interface ITimeHandlrSettings {
        /**
         * The default time separation between events in cycles (by default, 1).
         */
        timingDefault?: number;

        /**
         * Attribute name to store listings of cycles in objects (by default, 
         * "cycles").
         */
        keyCycles?: string;

        /**
         * Atribute name to store class name in objects (by default, "className").
         */
        keyClassName?: string;

        /**
         * Key to check for a callback before a cycle starts in objects (by default,
         * "onClassCycleStart").
         */
        keyOnClassCycleStart?: string;

        /**
         * Key to check for a callback after a cycle starts in objects (by default,
         * "doClassCycleStart").
         */
        keyDoClassCycleStart?: string;

        /**
         * Optional attribute to check for whether a cycle may be given to an 
         * object (if not given, ignored).
         */
        keyCycleCheckValidity?: string;

        /**
         * Whether a copy of settings should be made in setClassCycle.
         */
        copyCycleSettings?: boolean;

        /**
         * Function to add a class to a Thing (by default, String concatenation).
         */
        classAdd?: IClassChanger;

        /**
         * Function to remove a class from a Thing (by default, String removal).
         */
        classRemove?: IClassChanger;
    }

    export interface IEvent {
        /**
         * The time at which to call this event (which might be renamed to time).
         */
        timeDelay: number;

        /**
         * Arguments to be passed to the event callback.
         */
        args: any[];

        /**
         * How many times this should repeat. Infinity is an acceptable option.
         */
        repeat: number | IEventCallback;

        /**
         * How many times this event has been called.
         */
        count?: number;

        /**
         * How long between calls (irrelevant if repeat is 1, but useful for re-adding).
         */
        timeRepeat?: number;

        /**
         * A Function to run on the Event whenever it's handled in handleEvents,
         * commonly used to change repeat.
         */
        count_changer?: IEventCallback;

        /**
         * The callback to be run when this event is triggered (which will normally
         * be when the container TimeHandlr's internal time is equal to this event's
         * key in the events container).
         */
        callback(...args: any[]): IEventCallback;
    }

    export interface ITimeHandlr {
        getTime(): number;
        getEvents(): IEventsContainer;
        addEvent(callback: IEventCallback, timeDelay?: number, ...args: any[]): IEvent;
        addEventInterval(callback: IEventCallback, timeDelay?: number, numRepeats?: number, ...args: any[]): IEvent;
        addEventIntervalSynched(callback: IEventCallback, timeDelay: number, numRepeats: number, thing: any, settings: any): IEvent;
        handleEvents(): void;
        cancelEvent(event: IEvent): void;
        cancelAllEvents(): void;
        cancelClassCycle(thing: any, name: string): void;
        cancelAllCycles(thing: any): void;
        addClassCycle(thing: any, settings: any, name: string, timing: Number | Function): ITimeCycle;
        addClassCycleSynched(thing: any, settings: any, name: string, timing: Number | Function): ITimeCycle;
    }
}
