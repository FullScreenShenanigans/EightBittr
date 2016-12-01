import { ILogger } from "./logger";

/**
 * Implementation of the abstract Command class.
 */
export interface ICommandClass<TArgs, TResult> {
    /**
     * Initializes a new instance of a Command subclass.
     * 
     * @param logger   Logs on important events.
     */
    new(logger: ILogger): Command<TArgs, TResult>;
}

/**
 * Executable management command.
 * 
 * @param TArgs   Type of the command's arguments.
 * @param TResults   Type of the results.
 */
export abstract class Command<TArgs, TResults> {
    /**
     * Logs on important events.
     */
    protected readonly logger: ILogger;

    /**
     * Executes a command.
     * 
     * @param command   Class of the command to execute.
     * @param args   Arguments for the command.
     * @returns A Promise for the command's results.
     */
    public static execute<TArgs, TResult>(logger: ILogger, command: ICommandClass<TArgs, TResult>, args?: TArgs): Promise<TResult> {
        return new command(logger).execute(args);
    }

    /**
     * Initializes a new instance of the Command class.
     * 
     * @param logger   Logs on important events.
     */
    public constructor(logger: ILogger) {
        this.logger = logger;
    }

    /**
     * Executes the command.
     * 
     * @param args   Arguments for the command.
     * @returns A Promise for the command's results.
     */
    public abstract execute(args?: TArgs): Promise<TResults>;
}
